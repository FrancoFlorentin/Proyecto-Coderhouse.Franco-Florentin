import { Router } from 'express';
import { productManager } from '../manager/product-manager.js';
const router = Router();


router.get('/', async (req, res, next) => {
  try {
    const users = await productManager.getProducts();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:pid', async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    res.status(201).json(await productManager.createProduct(req.body))
  } catch (error) {
    next(error)
  }
})

router.put("/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params
    res.status(200).json(await productManager.updateProduct(req.body, pid))
  } catch (error) {
    next(error)
  }
})

router.delete("/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params
    res.json(await productManager.deleteProduct(pid))
  } catch (error) {
    next(error)
  }
})

export default router