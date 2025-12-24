import nodemailer from 'nodemailer'
import { mailConfig } from '../config/mail.config.js'

export class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mailConfig.mail.user,
        pass: mailConfig.mail.pass,
      }
    })
  }

  async sendTestMail(to) {
    const mailoptions = {
      from: mailConfig.mail.from,
      to,
      subject: "Test Mail",
      html: `
        <h1>Esto es un mail de testeo</h1>
      `
    }

    return this.transporter.sendMail(mailoptions)
  }

  async sendForgotPasswordEmail(email, resetUrl) {
    const mailoptions = {
      from: mailConfig.mail.from,
      to: email,
      subject: "Olvidé mi contraseña",
      html: `
        <h1>Para recuperar la contraseña haga click en el siguiente enlace:</h1>
        <a href="${resetUrl}"
          style="padding:12px 20px;background:#000;color:#fff;text-decoration:none;">
          Restablecer contraseña
        </a>
      `
    }

    return this.transporter.sendMail(mailoptions)
  }
  
}