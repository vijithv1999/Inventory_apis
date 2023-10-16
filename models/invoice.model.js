import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
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
});

const userschema = new mongoose.Schema({
    name: String,
    email: String,
    id: String
});
const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        index: true
    },
    customerName: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        index: true
    },
    products: {
        type: [productSchema],
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    transactionId: {
        type: String,
        index: true
    },
    date:String,
    remark: String,
    paymentMode: String,
    paymentRef: String,
    isPaymentCompleted: {
        type: Boolean,
        required: true,
    },
    user: userschema
}, { timestamps:true});

const InvoiceSchema = mongoose.model('invoice_schemas', invoiceSchema);

export default InvoiceSchema