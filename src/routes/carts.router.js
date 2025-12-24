import { Router } from 'express';
import { cartController } from '../controllers/cart.controller.js';
import { currentAuth } from '../middlewares/currentAuth';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.post('/', cartController.createCart)

router.get('/:cid', cartController.findCartById)

router.put('/:cid', currentAuth, authorize("user"), cartController.updateCart)

router.post('/:cid/products/:pid', currentAuth, authorize("user"), cartController.addProductToCart)

router.delete('/:cid/products/:pid', currentAuth, authorize("user"), cartController.removeProductFromCart)

router.delete("/clear/:cid", currentAuth, authorize("user"), cartController.clearCart); 

export default router