import cartModel from "../models/cart.model.js";

export default class CartManager {
  constructor() {
    console.log("Working with cart using database");
  }

  getAll = async () => {
    const carts = await cartModel.find().lean();

    return carts;
  };

  create = async (cart) => {
    const result = await cartModel.create(cart);

    return result;
  };

  addStudent = async (cartId, studentId) => {
    const cart = await cartModel.findById(cartId);

    cart.students.push({ studentId });
    return course.save();
  };
}