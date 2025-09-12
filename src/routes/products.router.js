import { Router } from 'express';
import { productManager } from '../manager/product-manager.js';
import { productController } from '../controllers/product.controller.js';
const router = Router();



router.get('/', productController.getAllProducts)

router.get('/:pid', async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
})

router.post("/", productController.createProduct)

router.put("/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params
    res.status(200).json(await productManager.updateProduct(req.body, pid))
  } catch (error) {
    next(error)
  }
})

router.delete("/:pid", productController.deleteProduct)

export default router