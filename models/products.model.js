import mongoose from "mongoose";

const Product = new mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    code: {
        type: String,
        index: true
    }
})

let productSchema = mongoose.model("product_schemas", Product)
export default productSchema