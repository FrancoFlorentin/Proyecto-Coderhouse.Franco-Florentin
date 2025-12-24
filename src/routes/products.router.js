import { Router } from 'express';
import { productManager } from '../manager/product-manager.js';
import { productController } from '../controllers/product.controller.js';
import { currentAuth } from '../middlewares/currentAuth';
import { authorize } from '../middlewares/authorize.js';
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

router.post("/", 
  currentAuth,
  authorize("admin"),
productController.createProduct)

router.put("/:pid", currentAuth, authorize("admin"), async (req, res, next) => {
  try {
    const { pid } = req.params
    res.status(200).json(await productManager.updateProduct(req.body, pid))
  } catch (error) {
    next(error)
  }
})

router.delete("/:pid", currentAuth, authorize("admin"), productController.deleteProduct)

export default router