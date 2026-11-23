import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getReply, suggestions } from '../../services/chatService'
import BotLogo from './BotLogo'

const welcome = (name) => ({
  id: 'welcome',
  from: 'bot',
  text: `Hi ${name}! I am FitBot. Ask me about your workouts, meals and goals, how to use FitTrack, or any fitness question.`,
  links: [],
  next: suggestions,
})

const seenHello = () => {
  try {
    return sessionStorage.getItem('ft_bot_hello') === '1'
  } catch {
    return false
  }
}

const markHello = () => {
  try {
    sessionStorage.setItem('ft_bot_hello', '1')
  } catch {
    return
  }
}

function ChatBot() {
  const { user } = useAuth()
  const firstName = user.name.split(' ')[0]
  const [open, setOpen] = useState(false)
  const [hello, setHello] = useState(false)
  const [messages, setMessages] = useState(() => [welcome(firstName)])
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const body = useRef(null)
  const input = useRef(null)

  useEffect(() => {
    if (seenHello()) return

    const show = setTimeout(() => setHello(true), 2500)
    const hide = setTimeout(() => {
      setHello(false)
      markHello()
    }, 9500)

    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  useEffect(() => {
    if (body.current) body.current.scrollTop = body.current.scrollHeight
  }, [messages, typing, open])

  useEffect(() => {
    if (!open) return

    if (window.innerWidth >= 576) input.current.focus()

    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const toggle = () => {
    setOpen(!open)
    setHello(false)
    markHello()
  }

  const send = async (question) => {
    const value = question.trim()
    if (!value || typing) return

    setMessages((list) => [...list, { id: `u${Date.now()}`, from: 'user', text: value }])
    setText('')
    setTyping(true)

    const answer = await getReply(value, user)
    setTimeout(() => {
      setMessages((list) => [...list, { id: `b${Date.now()}`, from: 'bot', ...answer }])
      setTyping(false)
    }, 600)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    send(text)
  }

  const handleLink = () => {
    if (window.innerWidth < 576) setOpen(false)
  }

  const last = messages[messages.length - 1]
  const chips = !typing && last.from === 'bot' && last.next ? last.next : []

  return (
    <>
      {open && (
        <section className="bot-panel" role="dialog" aria-label="FitBot chat">
          <header className="bot-head">
            <span className="bot-logo">
              <BotLogo thinking={typing} />
            </span>
            <div>
              <strong>FitBot</strong>
              <small>
                <span className="bot-dot"></span>
                {typing ? 'Typing...' : 'Online'}
              </small>
            </div>
            <button type="button" className="bot-icon" onClick={() => setMessages([welcome(firstName)])} aria-label="Clear chat" title="Clear chat">
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
            <button type="button" className="bot-icon" onClick={() => setOpen(false)} aria-label="Close chat">
              <i className="bi bi-x-lg"></i>
            </button>
          </header>

          <div className="bot-body" ref={body}>
            {messages.map((item) => (
              <div className={`bot-row ${item.from}`} key={item.id}>
                {item.from === 'bot' && (
                  <span className="bot-ava">
                    <BotLogo />
                  </span>
                )}
                <div className={`bot-msg ${item.from}`}>
                  {item.text}
                  {item.links && item.links.length > 0 && (
                    <div className="bot-links">
                      {item.links.map((link) => (
                        <Link key={link.to + link.label} to={link.to} className="bot-link" onClick={handleLink}>
                          {link.label}
                          <i className="bi bi-arrow-right"></i>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="bot-row bot">
                <span className="bot-ava">
                  <BotLogo thinking />
                </span>
                <div className="bot-msg bot bot-typing" aria-label="FitBot is typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {chips.length > 0 && (
              <div className="bot-chips">
                {chips.map((item) => (
                  <button key={item} type="button" className="bot-chip" onClick={() => send(item)}>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="bot-form" onSubmit={handleSubmit}>
            <input
              ref={input}
              className="form-control"
              placeholder="Type your question"
              aria-label="Type your question"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
            <button type="submit" className="bot-send" disabled={!text.trim() || typing} aria-label="Send">
              <i className="bi bi-send-fill"></i>
            </button>
          </form>
        </section>
      )}

      {hello && !open && (
        <button type="button" className="bot-hello" onClick={toggle}>
          Hi {firstName}! Need a hand?
        </button>
      )}

      <button type="button" className={`bot-fab ${open ? 'open' : ''}`} onClick={toggle} aria-label="Chat with FitBot" aria-expanded={open}>
        {open ? <i className="bi bi-x-lg"></i> : <BotLogo />}
      </button>
    </>
  )
}

export default ChatBot
