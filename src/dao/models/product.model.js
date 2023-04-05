import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
 
});

const productModel = mongoose.model("products", productsSchema);
export default productModel;