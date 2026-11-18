import { storage } from '../utils/storage'

export const createStore = (key, seed) => ({
  read() {
    const saved = storage.get(key)
    if (saved) return JSON.parse(saved)
    storage.set(key, JSON.stringify(seed))
    return seed
  },

  save(list) {
    storage.set(key, JSON.stringify(list))
  },
})
