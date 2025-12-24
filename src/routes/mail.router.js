import { Router } from "express";
import { sendMail } from "../controllers/mail.controller.js";

const router = Router()
router.post("/mail", sendMail)

export default router