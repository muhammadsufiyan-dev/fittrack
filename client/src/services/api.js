import { storage } from '../utils/storage'
import { todayISO } from '../utils/format'

const TOKEN_KEY = 'ft_token'
const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')

export const getToken = () => storage.get(TOKEN_KEY)
export const setToken = (token) => storage.set(TOKEN_KEY, token)
export const clearToken = () => storage.remove(TOKEN_KEY)

const request = async (method, path, body) => {
  const token = getToken()
  const hasBody = body !== undefined
  let response

  try {
    response = await fetch(base + path, {
      method,
      headers: { ...(hasBody ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: hasBody ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Please check your connection and try again')
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && token) window.dispatchEvent(new Event('ft-session-expired'))
    const error = new Error((data && data.message) || 'Something went wrong. Please try again')
    error.status = response.status
    throw error
  }

  return data
}

const withToday = (path, params = {}) => `${path}?${new URLSearchParams({ ...params, today: todayISO() })}`

const cache = new Map()
const pending = new Map()
const TTL = 15000

const cachedGet = (url) => {
  const key = `${getToken()}|${url}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.time < TTL) return Promise.resolve(structuredClone(hit.data))
  if (pending.has(key)) return pending.get(key).then((data) => structuredClone(data))

  const job = request('GET', url)
    .then((data) => {
      cache.set(key, { data, time: Date.now() })
      return data
    })
    .finally(() => pending.delete(key))

  pending.set(key, job)
  return job.then((data) => structuredClone(data))
}

const change = async (job) => {
  try {
    return await job
  } finally {
    cache.clear()
  }
}

export const api = {
  get: (path, params) => cachedGet(withToday(path, params)),
  post: (path, body = {}) => change(request('POST', path, body)),
  put: (path, body = {}) => change(request('PUT', path, body)),
  remove: (path) => change(request('DELETE', path)),
}