import dotenv from 'dotenv'

dotenv.config()

for (const key of ['MONGO_URI', 'JWT_SECRET']) {
  if (!process.env[key]) {
    console.error(`Missing ${key} in the .env file`)
    process.exit(1)
  }
}

if (process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters')
  process.exit(1)
}

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((item) => item.trim()),
  isProd: process.env.NODE_ENV === 'production',
  appUrl: (process.env.APP_URL || 'http://localhost:5173/fittrack').replace(/\/$/, ''),
  mail: { user: process.env.MAIL_USER || '', pass: process.env.MAIL_PASS || '' },
}

