import { api } from './api'

export const supportTypes = [
  { value: 'question', label: 'Question', icon: 'bi-question-circle' },
  { value: 'issue', label: 'Report a problem', icon: 'bi-bug' },
  { value: 'feedback', label: 'Feedback', icon: 'bi-chat-heart' },
]

export const getRequests = async () => {
  const { requests } = await api.get('/support')
  return requests
}

export const addRequest = async (data) => {
  const { request } = await api.post('/support', data)
  return request
}

export const deleteRequest = async (id) => {
  await api.remove(`/support/${id}`)
}

const formspreeId = import.meta.env.VITE_FORMSPREE_ID

export const sendToFormspree = async (data) => {
  if (!formspreeId) return

  try {
    await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
  } catch {
    return
  }
}