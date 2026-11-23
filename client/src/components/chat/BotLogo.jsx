function BotLogo({ className = '', thinking = false }) {
  return (
    <svg className={`bl ${thinking ? 'thinking' : ''} ${className}`} viewBox="0 0 64 64" aria-hidden="true">
      <line className="bl-stem" x1="32" y1="8" x2="32" y2="15" />
      <circle className="bl-bulb" cx="32" cy="6" r="3.4" />
      <rect className="bl-ear" x="3" y="27" width="7" height="13" rx="3.5" />
      <rect className="bl-ear" x="54" y="27" width="7" height="13" rx="3.5" />
      <rect className="bl-head" x="8" y="14" width="48" height="40" rx="16" />
      <rect className="bl-screen" x="14" y="20" width="36" height="28" rx="12" />
      <ellipse className="bl-eye" cx="25" cy="32" rx="3.7" ry="4.8" />
      <ellipse className="bl-eye" cx="39" cy="32" rx="3.7" ry="4.8" />
      <circle className="bl-cheek" cx="19.5" cy="40" r="2.3" />
      <circle className="bl-cheek" cx="44.5" cy="40" r="2.3" />
      <path className="bl-mouth" d="M27 40 Q32 45 37 40" />
    </svg>
  )
}

export default BotLogo
