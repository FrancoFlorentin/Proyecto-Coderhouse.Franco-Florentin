import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { productController } from "../controllers/product.controller.js";

const router = Router()

router.get('/', (req, res) => res.render('home'))
router.get('/realtimeproducts', (req, res) => res.render('realTimeProducts'))

router.get('/products/:id', productController.getProductView)
router.get('/carts/:id', cartController.getCartView)

export default router