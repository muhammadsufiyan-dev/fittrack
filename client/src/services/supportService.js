import { storage } from '../utils/storage'
import { createStore } from './localStore'

const store = createStore('ft_support', [])

export const supportTypes = [
  { value: 'question', label: 'Question', icon: 'bi-question-circle' },
  { value: 'issue', label: 'Report a problem', icon: 'bi-bug' },
  { value: 'feedback', label: 'Feedback', icon: 'bi-chat-heart' },
]

export const getRequests = async () => {
  return [...store.read()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export const addRequest = async (data) => {
  const item = { ...data, id: Date.now().toString(), status: 'Received', createdAt: new Date().toISOString() }
  store.save([...store.read(), item])
  return item
}

export const deleteRequest = async (id) => {
  store.save(store.read().filter((item) => item.id !== id))
}

export const clearRequests = () => storage.remove('ft_support')
