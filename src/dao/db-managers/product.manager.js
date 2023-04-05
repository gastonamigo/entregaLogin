import productModel from "../models/product.model.js";

export default class ProductManager {
  constructor() {
    console.log("Working with products using database");
  }

  getAll = async () => {
    const products = await productModel.find().lean();

    return products;
  };

  create = async (product) => {
    const result = await productModel.create(product);

    return result;
  };
}