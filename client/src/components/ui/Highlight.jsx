function Highlight({ text, query }) {
  const value = String(text)
  const index = query ? value.toLowerCase().indexOf(query.toLowerCase()) : -1

  if (index === -1) return value

  return (
    <>
      {value.slice(0, index)}
      <mark>{value.slice(index, index + query.length)}</mark>
      {value.slice(index + query.length)}
    </>
  )
}

export default Highlight
