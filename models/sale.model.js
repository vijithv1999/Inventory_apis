import mongoose from "mongoose";
const salesSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    serialId: {
        type: String,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    Date: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        index: true
    }
});

let Sales = mongoose.model("sales_schemas", salesSchema)
export default Sales
