import dotenv from 'dotenv'

dotenv.config()

export const mailConfig = {
  env: process.env.NODE_ENV || "development",
  mail: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM
  }
}