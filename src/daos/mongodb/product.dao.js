import { ProductModel } from "./models/product.model.js";

export default class ProductDaoMongoDB {
  constructor(model) {
    this.model = model
  }

  createProduct = async (obj) => {
    try {
      return await this.model.create(obj)
    } catch (error) {
      throw new Error(error);
    }
  }

  getAllProducts = async(page = 1, limit = 10, sort, query) =>  {
    try {
      const filter = {} 
      let sortOrder = {}

      // Filtro por query (categoría o disponibilidad)
      if (query) {
        if (query.toLowerCase() === "true" || query.toLowerCase() === "false") {
          // disponibilidad
          filter.status = query.toLowerCase() === "true";
        } else {
          // categoría
          filter.category = query;
        }
      }

      if (sort) sortOrder.price = sort === 'asc' ? 1 : sort === 'desc' ? -1 : null

      return await this.model.paginate(filter, { page, limit, sort: sortOrder })
    } catch (error) {
      throw new Error(error)
    }
  }

  getProductById = async (pid) => {
    try {
      return await this.model.findById(pid)
    } catch (error) {
      throw new Error(error)
    }
  }

  deleteProduct = async (pid) => {
    try {
      return await this.model.findByIdAndDelete(pid);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const productDao = new ProductDaoMongoDB(ProductModel)