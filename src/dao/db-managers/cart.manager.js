import CartModel from "../models/cart.model.js"

export default class CartManager {
    constructor() {
        console.log("Working with DB")
    }

    async getCarts() {
        try {
            const carts = await CartModel.find().lean()
            return carts
        } catch (err) {
            console.error("Error getting carts:", err)
            return []
        }
    }

    async addCart() {
        try {
            const cart = {
                products: []
            }
            const result = await CartModel.create(cart)
            return result
        } catch (err) {
            throw new Error(`Error adding cart: ${err}`)
        }
    }

    async getCartProducts(id) {
        try {
            const cart = await CartModel.findById(id).populate("products.product").lean()
            return cart
        } catch (err) {
            throw new Error(`Error getting cart products: ${err}`)
        }
    }

    async addProductToCart(product, cartID) {
        try {
            const cart = await CartModel.findById(cartID)
            const { products } = cart
            const productInCart = products.find(({ product: p }) => p.toString() === product._id.toString())

            if (productInCart) {
                productInCart.quantity += 1
            } else {
                products.push({ product: product._id })
            }

            await CartModel.findByIdAndUpdate(cartID, { products }, { new: true }).populate("products.product")
        } catch (err) {
            throw new Error(`Error adding product to cart: ${err}`)
        }
    }

    async deleteProductInCart(cartID, productID) {
        try {
            const cart = await CartModel.findById(cartID)
            const { products } = cart
            const product = products.find(({ product: p }) => p.toString() === productID)

            if (!product) {
                throw new Error("No existe producto con ese ID")
            }

            if (product.quantity > 1) {
                product.quantity -= 1
            } else {
                products = products.filter(({ product: p }) => p.toString() !== productID)
            }

            await CartModel.findByIdAndUpdate(cartID, { products }, { new: true }).populate("products.product")
        } catch (err) {
            throw new Error(`Error deleting product from cart: ${err}`)
        }
    }

    async moreQuantity(cartID, productID, quantity) {
        try {
            const cart = await CartModel.findById(cartID)
            const { products } = cart
            const product = products.find(({ product: p }) => p.toString() === productID)

            if (!product) {
                products.push({ product: productID, quantity })
            } else {
                product.quantity += quantity
            }

            await CartModel.findByIdAndUpdate(cartID, { products }, { new: true }).populate("products.product")
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