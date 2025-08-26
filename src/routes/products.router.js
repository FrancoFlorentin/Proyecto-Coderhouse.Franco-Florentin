import { Router } from 'express';
import { productManager } from '../manager/product-manager.js';
const router = Router();


router.get('/', async (req, res, next) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json(products);
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
  const io = req.app.get("io");
  try {
    const newProduct = await productManager.createProduct(req.body)
    io.emit('newProduct', newProduct)
    res.status(201).json({message: "Producto creado correctamente"})
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
  const io = req.app.get("io");
  try {
    const { pid } = req.params
    await productManager.deleteProduct(pid)
    io.emit('deleteProduct', pid)
    res.status(200).json({message: "Producto eliminado correctamente"})
  } catch (error) {
    next(error)
  }
})

export default router