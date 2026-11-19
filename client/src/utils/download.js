const cell = (value) => `"${String(value).replace(/"/g, '""')}"`

export const downloadCSV = (name, rows) => {
  const text = rows.map((row) => row.map(cell).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}
