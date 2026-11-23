export const resizeImage = (file, size = 240) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = reject
    reader.onload = () => {
      const image = new Image()

      image.onerror = reject
      image.onload = () => {
        const side = Math.min(image.width, image.height)
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        canvas
          .getContext('2d')
          .drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, size, size)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }

      image.src = reader.result
    }

    reader.readAsDataURL(file)
  })
