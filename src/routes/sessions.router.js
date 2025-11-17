import { Router } from 'express'
import User from '../daos/mongodb/models/user.model.js'
import passport from '../config/passport.js'
import jwt from 'jsonwebtoken'

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

    req.user = user;
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


export default router;
