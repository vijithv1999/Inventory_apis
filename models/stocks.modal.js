import mongoose from "mongoose";

// Define the schema
const Stocks = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true, // Create an index for the name field
    },
    code: {
        type: String,
        required: true,
        index: true, // Create an index for the id field
    },
    unit: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    availableQuantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
    },
    date: {
        type: String,
        required: true,
    },
    updatedDate: {
        type: String,
        required: true,
    },
    serialId: {
        type: String,
        required: true,
        index: true, // Create an index for the serialId field
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    isGst:{
        type:Boolean,
        default:false
    },
    gst:String

});

// Create a model from the schema
const stockSchema = mongoose.model('stock_schemas', Stocks);

export default stockSchema;
