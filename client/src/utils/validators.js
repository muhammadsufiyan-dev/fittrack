export const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value)

export const passwordStrength = (password) => {
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

export const validateRegister = (form) => {
  const errors = {}

  if (form.name.trim().length < 2) {
    errors.name = 'Enter your full name'
  }

  if (!isEmail(form.email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(form.password)) {
    errors.password = 'Use at least 8 characters with a letter and a number'
  }

  if (form.confirm !== form.password) {
    errors.confirm = 'Passwords do not match'
  }

  if (!form.consent) {
    errors.consent = 'You need to accept the privacy policy'
  }

  return errors
}