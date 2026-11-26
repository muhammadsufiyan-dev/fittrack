import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getReply } from '../../services/chatService'
import BotLogo from './BotLogo'

const topics = [
  { icon: 'bi-lightning-charge-fill', label: 'Workouts', ask: 'Beginner workout plan' },
  { icon: 'bi-egg-fried', label: 'Nutrition', ask: 'Healthy eating tips' },
  { icon: 'bi-capsule', label: 'Supplements', ask: 'Best supplements' },
  { icon: 'bi-graph-down-arrow', label: 'Weight loss', ask: 'How to lose weight?' },
]

const starters = ['How was my week?', 'What is protein?', 'Benefits of creatine', 'Calories today', 'Give me a tip']

const clock = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

const welcome = (name) => ({
  id: 'welcome',
  from: 'bot',
  text: `Hi ${name}! I am FitBot, your fitness and nutrition assistant. Ask me about your training, meals, supplements or how to use FitTrack.`,
  links: [],
  topics: true,
  next: starters,
  time: clock(),
})

const Rich = ({ text }) => {
  const blocks = []

  text.split('\n').forEach((line) => {
    if (!line.trim()) return

    if (line.startsWith('- ')) {
      const last = blocks[blocks.length - 1]
      if (last && last.items) last.items.push(line.slice(2))
      else blocks.push({ items: [line.slice(2)] })
      return
    }

    blocks.push({ line })
  })

  return blocks.map((block, index) =>
    block.items ? (
      <ul className="bot-list" key={index}>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className={block.line.endsWith(':') ? 'bot-label' : ''} key={index}>
        {block.line}
      </p>
    )
  )
}

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
  const [wide, setWide] = useState(false)
  const [far, setFar] = useState(false)
  const [copied, setCopied] = useState('')
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
    if (body.current) body.current.scrollTo({ top: body.current.scrollHeight, behavior: 'smooth' })
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

    setMessages((list) => [...list, { id: `u${Date.now()}`, from: 'user', text: value, time: clock() }])
    setText('')
    setTyping(true)

    const answer = await getReply(value, user)
    setTimeout(() => {
      setMessages((list) => [...list, { id: `b${Date.now()}`, from: 'bot', time: clock(), ...answer }])
      setTyping(false)
    }, 700)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    send(text)
  }

  const handleScroll = () => {
    const el = body.current
    setFar(el.scrollHeight - el.scrollTop - el.clientHeight > 140)
  }

  const goDown = () => body.current.scrollTo({ top: body.current.scrollHeight, behavior: 'smooth' })

  const copy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.text)
      setCopied(item.id)
      setTimeout(() => setCopied(''), 1600)
    } catch {
      return
    }
  }

  const handleLink = () => {
    if (window.innerWidth < 576) setOpen(false)
  }

  const last = messages[messages.length - 1]
  const chips = !typing && last.from === 'bot' && last.next ? last.next : []

  return (
    <>
      {open && (
        <section className={`bot-panel ${wide ? 'wide' : ''}`} role="dialog" aria-label="FitBot chat">
          <header className="bot-head">
            <span className="bot-logo">
              <BotLogo thinking={typing} />
            </span>
            <div>
              <strong>FitBot</strong>
              <small>
                <span className="bot-dot"></span>
                {typing ? 'Typing...' : 'Fitness assistant, online'}
              </small>
            </div>
            <button type="button" className="bot-icon bot-size" onClick={() => setWide(!wide)} aria-label={wide ? 'Smaller window' : 'Bigger window'} title={wide ? 'Smaller window' : 'Bigger window'}>
              <i className={`bi ${wide ? 'bi-fullscreen-exit' : 'bi-arrows-fullscreen'}`}></i>
            </button>
            <button type="button" className="bot-icon" onClick={() => setMessages([welcome(firstName)])} aria-label="Clear chat" title="Clear chat">
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
            <button type="button" className="bot-icon" onClick={() => setOpen(false)} aria-label="Close chat">
              <i className="bi bi-x-lg"></i>
            </button>
          </header>

          <div className="bot-body" ref={body} onScroll={handleScroll}>
            <div className="bot-hero">
              <span className="bot-hero-logo">
                <BotLogo />
              </span>
              <h3>FitBot</h3>
              <p>Ask about workouts, nutrition and supplements</p>
            </div>

            <span className="bot-day">Today</span>

            {messages.map((item) => (
              <div className={`bot-row ${item.from}`} key={item.id}>
                {item.from === 'bot' && (
                  <span className="bot-ava">
                    <BotLogo />
                  </span>
                )}
                <div className="bot-col">
                  <div className={`bot-msg ${item.from}`}>
                    {item.from === 'bot' ? <Rich text={item.text} /> : item.text}
                    {item.topics && (
                      <div className="bot-topics">
                        {topics.map((topic, index) => (
                          <button key={topic.label} type="button" className="bot-topic" style={{ '--i': index }} onClick={() => send(topic.ask)}>
                            <i className={`bi ${topic.icon}`}></i>
                            {topic.label}
                          </button>
                        ))}
                      </div>
                    )}
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
                  <div className="bot-meta">
                    {item.time && <time className="bot-time">{item.time}</time>}
                    {item.from === 'bot' && item.id !== 'welcome' && (
                      <button type="button" className={`bot-copy ${copied === item.id ? 'done' : ''}`} onClick={() => copy(item)} aria-label="Copy answer">
                        <i className={`bi ${copied === item.id ? 'bi-check2' : 'bi-clipboard'}`}></i>
                        {copied === item.id ? 'Copied' : 'Copy'}
                      </button>
                    )}
                  </div>
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
              <div className="bot-chips" key={last.id}>
                {chips.map((item, index) => (
                  <button key={item} type="button" className="bot-chip" style={{ '--i': index }} onClick={() => send(item)}>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {far && (
            <button type="button" className="bot-down" onClick={goDown} aria-label="Scroll to latest message">
              <i className="bi bi-arrow-down"></i>
            </button>
          )}

          <form className="bot-form" onSubmit={handleSubmit}>
            <input
              ref={input}
              className="form-control"
              placeholder="Type your question"
              aria-label="Type your question"
              value={text}
              maxLength={200}
              onChange={(event) => setText(event.target.value)}
            />
            {text.length > 140 && <span className="bot-count">{text.length}/200</span>}
            <button type="submit" className="bot-send" disabled={!text.trim() || typing} aria-label="Send">
              <i className="bi bi-send-fill"></i>
            </button>
          </form>
          <p className="bot-note">FitBot gives general fitness information, not medical advice.</p>
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
