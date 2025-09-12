import { CartModel } from "./models/cart.model.js";


class CartDaoMongoDB {
  constructor(model) {
    this.model = model
  }

  createCart = async () => {
    try {
      return await this.model.create({
        products: [],
      });
    } catch (error) {
      throw new Error(error)
    }
  }

  findCartById = async (id) => {
    try {
      return await this.model.findById(id).populate('products.product')
    } catch (error) {
      throw new Error(error)
    }
  }

  addProductToCart = async (cid, pid) => {
    try {
      const existProdInCart = await this.existProdInCart(cid, pid);
      if(existProdInCart){
        return await this.model.findOneAndUpdate(
          { _id: cid, 'products.product': pid },
          { $inc: { 'products.$.quantity': 1 } },
          { new: true }
        );
      } else {
        return await this.model.findByIdAndUpdate(
          cid,
          { $push: { products: { product: pid } } },
          { new: true }
        )
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  existProdInCart = async (cid, pid) => {
    try {
      return await this.model.findOne({
        _id: cid,
        products: { $elemMatch: { product: pid } }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  removeProductFromCart = async (cid, pid) => {
    try {
      return await this.model.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { product: pid } } },
        { new: true }
      );
    } catch (error) {
      throw new Error(error)
    }
  } 

  updateCart = async (cid, obj) => {
    try {
      return await this.model.findByIdAndUpdate(id, obj, {
        new: true,
      });
    } catch (error) {
      throw new Error(error)
    }
  }

  clearCart = async (cid) => {
    try {
      const updatedCart = await this.model.findOneAndUpdate(
        { _id: cid },
        { $set: { products: [] } },
        { new: true }
      );
      return updatedCart
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const cartDao = new CartDaoMongoDB(CartModel)