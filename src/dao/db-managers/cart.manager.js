import CartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export default class CartManager {
    constructor() {
        console.log("Working with DB");
    }

    async getCarts() {
        try {
            const carts = await CartModel.find().lean();
            return carts;
        } catch (err) {
            console.error("Error getting carts:", err);
            return [];
        }
    }

    async addCart() {
        try {
            const cart = {
                products: [],
            }
            const result = await CartModel.create(cart);
            return result;
        } catch (err) {
            throw new Error(`Error adding cart: ${err}`);
        }
    }

    async getCartProducts(id) {
        try {
            const cart = await CartModel.findById(id).populate("products.product").lean();
            return cart;
        } catch (err) {
            throw new Error(`Error getting cart products: ${err}`);
        }
    }

    async addProductToCart(product, cartID) {
        try {
            const cart = await CartModel.findById(cartID)
            const productInCart = cart.products.find(
                (elem) => elem.product.toString() === prod._id.toString()
              );

            if (productInCart) {
                productInCart.quantity += 1
                await cart.save();
                await cart.populate("products.product");
            } else {
                cart.products.push({ product: product._id });
                await cart.save();
                await cart.populate("products.product");
            }

            // await CartModel.findByIdAndUpdate(cartID, { products }, { new: true }).populate("products.product")
        } catch (err) {
            throw new Error(`Error adding product to cart: ${err}`)
        }
    }

    async deleteProductInCart(cartID, productID) {
        try {
            const cart = await cartModel.findById(cartID);
      const product = cart.products.find(
        (elem) => elem.product.toString() === productID);

      if (!product) {
        throw new Error("No existe producto con ese ID");
      }
            if (product.quantity > 1) {
                product.quantity -= 1;
                cart.save();
            } else {
                let newCartProducts = cart.products.filter(
                    (p) => p.product.toString() !== productID
                  );
                  cart.products = newCartProducts;
                  cart.save();
            }

            // await CartModel.findByIdAndUpdate(cartID, { products }, { new: true }).populate("products.product")
        } catch (err) {
            throw new Error(`Error deleting product from cart: ${err}`)
        }
    }

    async addProductListToCart(cid, product_list) {
        try {
          const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cid },
            { $set: { products: { $each: product_list } } },
            { new: true }
          );
          return updatedCart;
        } catch (err) {
          throw new Error(err);
        }
      }

      async moreQuantity(cartID, productID, quantity) {
        try {
          const cart = await cartModel.findById(cartID);
          const product = cart.products.find(
            (elem) => elem.product.toString() === productID
          );
    
          if (!cart) {
            throw new Error("No existe carrito con ese id.");
          }
    
          if (product) {
            product.quantity += quantity;
            await cart.save();
            await cart.populate("products.product");
          } else {
            cart.products.push({ product: productID });
            await cart.save();
            const newProduct = cart.products.find(
              (elem) => elem.product.toString() === productID
            );
            newProduct.quantity = quantity;
            await cart.save();
            await cart.populate("products.product");
          }
            // await CartModel.findByIdAndUpdate(cartID, { products }, { new: true }).populate("products.product")
        } catch (err) {
            throw new Error(`Error updating product quantity: ${err}`)
        }
    }

    async clearCart(cid) {
        try {
            const cart = await cartModel.findById(cid)
            if (!cart) {
                throw new Error("No existe carrito con ese id.")
            }
            cart.products = []
            await cart.save()
            return cart
        } catch (err) {
            throw new Error(err)
        }
    }
}