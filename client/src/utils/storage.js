const memory = {}

export const storage = {
  get(key) {
    try {
      return localStorage.getItem(key)
    } catch {
      return memory[key] ?? null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, value)
    } catch {
      memory[key] = value
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch {
      delete memory[key]
    }
  },
}
