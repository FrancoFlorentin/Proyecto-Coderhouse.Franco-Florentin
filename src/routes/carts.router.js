import { Router } from 'express';
import { cartController } from '../controllers/cart.controller.js';

const router = Router();

router.post('/', cartController.createCart)

router.get('/:cid', cartController.findCartById)

router.put('/:cid', cartController.updateCart)

router.post('/:cid/products/:pid', cartController.addProductToCart)

router.delete('/:cid/products/:pid', cartController.removeProductFromCart)

router.delete("/clear/:cid", cartController.clearCart); 

export default router