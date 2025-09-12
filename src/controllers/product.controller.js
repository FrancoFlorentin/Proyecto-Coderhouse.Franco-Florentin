import { productRepository } from '../repositories/product.repository.js'

class ProductController {
  constructor(repository) {
    this.repository = repository
  }

  createProduct = async (req, res, next) => {
    const io = req.app.get("io");
    try {
      const product = { ...req.body }
      const newProduct = await this.repository.createProduct(product)
      if (!newProduct) return res.status(404).json({ message: "Error al crear el producto"})
      io.emit('newProduct', newProduct)
      return res.json({message: "Producto creado correctamente", newProduct})
    } catch (error) {
      next(error)
    }
  }

  getAllProducts = async (req, res, next) => {
    try {
      const { page, limit, sort, query } = req.query
      const response = await this.repository.getAllProducts(page, limit, sort, query)

      const nextLink = response.hasNextPage
        ? `http://localhost:8080/?page=${response.nextPage}`
        : null
      const prevLink = response.hasPrevPage
        ? `http://localhost:8080/?page=${response.prevPage}`
        : null

      res.json({
        status: "success",
        payload: response.docs,
        totalPages: response.totalPages,
        prevPage: response.prevPage,
        nextPage: response.nextPage,
        page: response.page,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
        prevLink,
        nextLink
      })
    } catch (error) {
      next(error)
    }
  }

  getProductView = async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await this.repository.getProductById(id)
      if (!product) res.render("home")
      res.render("product", { product: product.toObject() });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    const io = req.app.get("io");
    try {
      const { pid } = req.params;
      const prodDel = await this.repository.deleteProduct(pid);
      io.emit('deleteProduct', pid)
      res.status(200).json({ messge: `Producto: ${prodDel._id} eliminado` });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController(productRepository)