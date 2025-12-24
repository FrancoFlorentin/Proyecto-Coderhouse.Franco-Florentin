import { cartRepository } from "../repositories/cart.repository.js";

class CartController {
  constructor(repository) {
    this.repository = repository
  }

  createCart = async (req, res, next) => {
    try {
      const newCart = await this.repository.createCart()
      return res.status(200).json(newCart)
    } catch (error) {
      next(error)
    }
  }

  findCartById = async (req, res, next) => {
    try {
      const { cid } = req.params
      const cart = await this.repository.findCartById(cid)
      return res.status(200).json(cart)
    } catch (error) {
      next(error)
    }
  }

  getCartView = async (req, res, next) => {
    try {
      const { id } = req.params;
      const cart = await this.repository.findCartById(id)
      res.render("cart", { cart: cart.toObject() });
    } catch (error) {
      next(error);
    }
  };

  addProductToCart = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const { pid } = req.params;
      const newProductToCart = await this.repository.addProductToCart(cid, pid);
      return res.status(200).json(newProductToCart);
    } catch (error) {
      next(error)
    }
  }

  removeProductFromCart = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const { pid } = req.params;
      const deletedProduct = await this.repository.removeProductFromCart(cid, pid);
      return res.json({msg: `Producto eliminado del carrito`});
    } catch (error) {
      next(error);
    }
  }

  updateCart = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const cartUpd = await this.repository.updateCart(cid, req.body);
      return res.status(200).json(cartUpd);
    } catch (error) {
      next(error);
    }
  }

  clearCart = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const clearCart = await this.repository.clearCart(cid);
      return res.json(clearCart);
    } catch (error) {
      next(error)
    }
  }
}

export const cartController = new CartController(cartRepository)