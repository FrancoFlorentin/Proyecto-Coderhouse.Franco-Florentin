import { Router } from 'express';
import { cartManager } from '../manager/cart-manager.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    res.status(201).json(await cartManager.createCart(req.body))
  } catch (error) {
    next(error)
  }
})

router.get('/:cid', async (req, res, next) => {
  try {
    const { cid } = req.params
    const products = await cartManager.getProductsByCartId(cid)
    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
})

router.post('/:cid/product/:pid', async (req, res, next) => {
  try {
    const { cid, pid } = req.params
    res.status(200).json(await cartManager.saveProductToCart(cid, pid))
  } catch (error) {
    next(error)
  }
})

export default router