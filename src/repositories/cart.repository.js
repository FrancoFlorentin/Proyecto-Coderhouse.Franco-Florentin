import { cartDao } from "../daos/mongodb/cart.dao.js"
import { CustomError } from "../utils.js"
import { productRepository } from "./product.repository.js"


class CartRepository {
  constructor(dao) {
    this.dao = dao
  }

  createCart = async (obj) => {
    try {
      return await this.dao.createCart(obj)
    } catch (error) {
      throw error
    }
  }

  findCartById = async (id) => {
    try {
      const cart = await this.dao.findCartById(id)
      if (!cart) throw new CustomError("Carrito no encontrado", 404)
      return cart
    } catch (error) {
      throw error
    }
  }

  addProductToCart = async (cid, pid) => {
    try {
      const existCart = await this.findCartById(cid);
      if (!existCart) throw new CustomError("Carrito no encontrado, 404")
      const existProd = await productRepository.getProductById(pid);
      if (!existProd) throw new CustomError("Producto no encontrado, 404")
  
      return await cartDao.addProductToCart(existCart._id, existProd._id);
    } catch (error) {
      throw error;
    }
  };

  removeProductFromCart = async (cid, pid) => {
    try {
      const existCart = await this.dao.findCartById(cid)
      if (!existCart) throw new CustomError("Carrito no encontrado", 404)
      const existProdInCart = this.dao.existProdInCart(cid, pid)
      if (!existProdInCart) throw new CustomError("Producto no encontrado, 404")
      return await this.dao.removeProductFromCart(cid, pid);
    } catch (error) {
      throw error;
    }
  }

  updateCart = async (cid, obj) => {
    try {
      const cartUpd = await this.dao.updateCart(cid, obj);
      if (!cartUpd) throw new CustomError("Carrito no encontrado", 404);
      return cartUpd
    } catch (error) {
      throw error;
    }
  }

  clearCart = async (cid) => {
    try {
      const existCart = await this.findCartById(cid);
      if (!existCart) throw new CustomError("Carrito no encontrado, 404")
      return await this.dao.clearCart(cid);
    } catch (error) {
      throw error
    }
  }
}

export const cartRepository = new CartRepository(cartDao)