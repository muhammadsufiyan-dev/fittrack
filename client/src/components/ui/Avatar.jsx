function Avatar({ user, className = '' }) {
  return (
    <span className={`pfp ${className}`}>
      {user.photo ? <img src={user.photo} alt="" /> : user.name.charAt(0).toUpperCase()}
    </span>
  )
}

export default Avatar
