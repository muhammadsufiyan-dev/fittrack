import { useState } from 'react'
import FormField from './FormField'

function PasswordField(props) {
  const [show, setShow] = useState(false)

  return (
    <FormField
      icon="bi-lock"
      type={show ? 'text' : 'password'}
      right={
        <button
          type="button"
          className="field-eye"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`}></i>
        </button>
      }
      {...props}
    />
  )
}

export default PasswordField
