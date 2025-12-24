import userModel from '../daos/mongodb/models/user.model.js'
import { MailService } from '../services/mail.service.js'

const mailService = new MailService()

export const sendMail = async (req, res) => {
  try {
    const { to } = req.body
    if (!to) return res.status(400).send({
      status: "error",
      message: "El campo 'to' es obligatorio"
    })

    const info = await mailService.sendTestMail(to)
    return res.json({
      status: "success",
      message: "Correo enviado",

    })
  } catch (error) {
    return res.status(500).send({status: "error", error: error.message})
  }
}