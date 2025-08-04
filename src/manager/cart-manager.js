import fs from 'fs'
import { productManager } from './product-manager.js'

class CartManager {
  constructor(path) {
    this.path = path
  }


  async #getCarts() {
    if (fs.existsSync(this.path)) {
      const carts = await fs.promises.readFile(this.path, "utf-8")
      return JSON.parse(carts)
    } return []
  }

  async createCart(obj) {
    // Generando Id autoincrementable
    const carts = await this.#getCarts()
    let id = 1
    if (carts.length) {
      for (const cart of carts) {
        let maxId = 1
        if (cart.id > maxId) {
          maxId = product.id
        }
        id = maxId + 1
      }
    }

    // Creando el nuevo carrito
    const newCart = {
      id,
      ...obj
    }
    carts.push(newCart)
    await fs.promises.writeFile(this.path, JSON.stringify(carts));
    return "Carrito creado correctamente"
  }

  async getProductsByCartId(id) {
    try {
      const carts = await this.#getCarts()
      const cart = carts.find(c => c.id === +id)
      if (!cart) {
        const error = new Error("Carrito inexistente")
        error.status = 404
        throw error 
      } 
      return cart.products
    } catch (error) {
      throw error
    }
  }

  async saveProductToCart(cid, pid) {
    try {
      // Busco el carrito en el arreglo de carritos
      let carts = await this.#getCarts()
      let cart = carts.find(c => c.id === +cid)
      if (!cart) {
        const error = new Error("Carrito inexistente")
        error.status = 404
        throw error 
      } 

      // Busco el producto que quiero agregar
      const product = await productManager.getProductById(pid)

      // Verifico si el producto está en el carrito
      let productExistsInCart = cart.products.find(p => p.product === +pid)
      
      if (productExistsInCart) { // Existe
        // Extraigo el array de productos del carrito (sin el producto a actualizar)
        let productsToUpdate = cart.products.filter(p => p.product !== +pid)
        const updatedProduct = {
          product: product.id,
          quantity: productExistsInCart.quantity + 1
        }
        // Agrego producto al carrito con cantidad aumentada y luego actualizo el array de productos del carrito
        productsToUpdate.push(updatedProduct)
        cart.products = productsToUpdate
      } else { // No existe
        const newProduct = {
          product: product.id,
          quantity: 1
        }
        cart.products.push(newProduct)
      }

      // Actualizo el arreglo de carritos
      let cartsToUpdate = carts.filter(c => c.id !== +cid)
      cartsToUpdate.push(cart)

      // Guardo los datos en la ddbb
      await fs.promises.writeFile(this.path, JSON.stringify(cartsToUpdate));
      return `Producto ${product.title} agregado al carrito`
    } catch (error) {
      throw error
    }
  }
}


export const cartManager = new CartManager("src/data/carts.json")