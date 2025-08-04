import fs from 'fs'

class ProductManager {
  constructor(path) {
    this.path = path
  } 

  async getProducts() {
    if (fs.existsSync(this.path)) {
      const products = await fs.promises.readFile(this.path, "utf-8")
      return JSON.parse(products)
    } return []
  }
  
  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id === +id);
      if (!product) {
        const error = new Error("Producto no encontrado");
        error.status = 404
        throw error
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async createProduct(obj) {
    try {

      // Generando Id autoincrementable
      const products = await this.getProducts()
      let id = 1
      if (products.length) {
        for (const product of products) {
          let maxId = 1
          if (product.id > maxId) {
            maxId = product.id
          }
          id = maxId + 1
        }
      }

      // Creando el nuevo producto
      const newProduct = {
        id,
        ...obj
      }

      products.push(newProduct)
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return "Producto creado correctamente"
    } catch (error) {
      throw error
    }
  }

  async updateProduct(obj, id) {
    try {
      const products = await this.getProducts();
      let product = await this.getProductById(id);
      product = {...product, ...obj};
      const updatedProductArray = products.filter((p) => p.id !== +id);
      updatedProductArray.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(updatedProductArray))
      return "Producto actualizado correctamente"
    } catch (error) {
      throw error
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts()
      const productExists = products.some((p) => p.id === +id) 
      if (!productExists) {
        const error = new Error("El producto que desea eliminar no existe")
        error.status = 404
        throw error
      }
      const deletedProductArray = products.filter((p) => p.id !== +id)
      await fs.promises.writeFile(this.path, JSON.stringify(deletedProductArray))
      return "Producto eliminado correctamente"
    } catch (error) {
      throw error
    }
  }
}


export const productManager = new ProductManager('src/data/products.json')