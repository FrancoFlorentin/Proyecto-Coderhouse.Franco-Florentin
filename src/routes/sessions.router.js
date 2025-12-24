import { Router } from 'express'
import User from '../daos/mongodb/models/user.model.js'
import passport from '../config/passport.js'
import { MailService } from '../services/mail.service.js'
import jwt from 'jsonwebtoken'
import userModel from '../daos/mongodb/models/user.model.js'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const router = Router()

const COOKIE = process.env.COOKIE_NAME || 'currentUser'
const IS_PROD = process.env.NODE_ENV === 'production'
const { JWT_SECRET, JWT_EXPIRES = '15m' } = process.env
const sign = (payload) => jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES})


router.post('/register', async (req, res, next) => {
  try {
    const { first_name, last_name, age, email, password, cart, role } = req.body || {}
    if (!first_name || !last_name || age === null || !email || !password) {
      return res.status(400).json({ error: "Faltan campos que completar"})
    }

    const normEmail = String(email).toLowerCase().trim()

    const isAdminShortcut = (normEmail === 'admincoder@coder.com' && password === '123456')
    const user = await User.create({
      first_name, last_name, age,
      email: normEmail,
      password,
      cart: cart ?? null,
      role: isAdminShortcut ? 'admin' : (role || 'user')
    })

    return res.status(201).json({ ok: true, id: user._id})
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({error: "Este email ya existe"})
    return next(error)
  }
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) return next(err)
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" })

    const token = sign(
      { sub: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie(COOKIE, token, {
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: IS_PROD,
      maxAge: 15 * 60 * 1000,
      path: '/'
    })
    return res.json({ ok: true })
  })(req, res, next)
})

router.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE, { path: '/' });
  res.json({ ok: true, message: 'Token eliminado' });
});

router.get('/current', (req, res, next) => {
  passport.authenticate("current", { session: false }, (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Internal server error",
        detail: err.message
      });
    }

    if (!user) return res.status(401).json({ error: "No autorizado" })

    req.user = user
    next();
  })(req, res, next);
}, 
(req, res) => {
  const { _id, email, createdAt, updatedAt } = req.user
  res.json({
    user: {
      id: _id,
      email,
      createdAt, 
      updatedAt
    }
  });
}
);

//! Olvidé contraseña
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "Este email no está registrado" });
  }

  // Token plano (se envía por mail)
  const token = crypto.randomBytes(32).toString("hex");

  // Token hasheado (se guarda en DB)
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hora
  await user.save();

  const protocol = req.protocol;
  const host = req.get("host");

  const resetUrl = `${protocol}://${host}/reset-password?token=${token}`;

  const mailService = new MailService()
  mailService.sendForgotPasswordEmail(user.email, resetUrl);

  res.json({ message: "Correo enviado" });
})


//! Resetear contraseña
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params
  const { newPassword, repeatNewPassword } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }, // no expirado
  });

  if (!user) {
    return res.status(400).json({ message: "Token inválido o expirado" });
  }

  if (newPassword !== repeatNewPassword) return res.status(400).json({message: "Las contraseñas no coinciden"})

  // Evitar misma contraseña
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    return res.status(400).json({
      message: "La nueva contraseña no puede ser igual a la anterior",
    });
  }

  // Actualizar password
  // const salt = await bcrypt.genSalt(10);
  user.password = newPassword;

  // Invalidar token
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Contraseña actualizada correctamente" });
})


export default router;
