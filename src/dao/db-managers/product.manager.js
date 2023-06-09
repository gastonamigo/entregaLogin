import producModel from "../models/product.model.js";

export default class ProductManager {
    constructor() {"Working with DB."}

   
    async getProducts({page, limit, sort, query}) {
        try {
             let newQuery = {}
       
              
            if (sort === "asc") {
                sort = { price: "asc" }
                 
            } else if (sort === "desc") {
                sort = { price: "desc" }
                 
            }

            const products = await producModel.paginate(
                newQuery,
                {
                    limit: limit || 10,
                    lean: true,
                    page: page || 1,
                    sort: sort || null
                }
            );
            
            
            return products;
        } catch (err) {
            console.log(err)
            return []
        }
    }

    async addProduct({title, description, price, thumbail, code, stock, status, category}) {

        code = Math.floor(Math.random() * 100000000000)

        try {
            const product = {
                title,
                description,
                price,
                thumbail,
                code,
                stock,
                status,
                category
            }
           
            const result = await producModel.create(product)
            
            return result
        } catch (err) {
            
            throw new Error(err.message)
        }
    }

    async getProductById(id) {
        try {
            const product = await producModel.findById(id)
            return product
        } catch (err) {
            throw new Error(err)
        }
    }

    async deleteProduct(id) {
        try {
            const result = await producModel.deleteOne({ _id: id })
            return result
        } catch (err) {
            throw new Error(err)
        }
    }

    async updateProduct(id, propModify) {
        try {
            const result = await producModel.findOneAndUpdate({ _id: id }, propModify, { new: true })
            return result
        } catch (err) {
            throw new Error(err)
        }
    }
}