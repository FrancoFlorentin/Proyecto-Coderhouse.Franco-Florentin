import { productDao } from "../daos/mongodb/product.dao.js"
import { CustomError } from '../utils.js'

class ProductRepository {
  constructor(dao) {
    this.dao = dao
  }

  createProduct = async (obj) => {
    try {
      return await this.dao.createProduct(obj)
    } catch (error) {
      throw error
    }
  }

  getAllProducts = async (page, limit, sort, query) => {
    try {
      return await this.dao.getAllProducts(page, limit, sort, query);
    } catch (error) {
      throw new Error(error);
    }
  } 

  getProductById = async (pid) => {
    try {
      const product = await this.dao.getProductById(pid)
      if (!product) throw new CustomError("Producto no encontrado", 404)
      return product
    } catch (error) {
      throw new Error(error);
    }
  }

  deleteProduct = async (pid) => {
    try {
      const prodDel = await this.dao.deleteProduct(pid);
      if (!prodDel) throw new CustomError("Producto no encontrado", 404);
      return prodDel;
    } catch (error) {
      throw error;
    }
  }
}

export const productRepository = new ProductRepository(productDao)