import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.js'
const router = Router();

router.get('/ping', isAuthenticated, (_req, res) => {
  res.json({ ok: true, msg: 'ping (protegido)' });
});

export default router;