import { useLocation, useNavigate } from 'react-router-dom'

function useGoTo() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (id) => {
    const scroll = () => {
      const target = document.getElementById(id)
      if (target) target.scrollIntoView({ behavior: 'smooth' })
    }

    if (pathname === '/') {
      scroll()
    } else {
      navigate('/')
      setTimeout(scroll, 200)
    }
  }
}

export default useGoTo