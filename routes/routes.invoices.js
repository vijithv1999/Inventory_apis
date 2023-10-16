import express from "express"
import invoiceFunctions from "../controllers/controller.invoice.js"

const invoiceRouter = express.Router()

invoiceRouter.post('/save', invoiceFunctions.createanInvoice)
invoiceRouter.get('/get/:id',invoiceFunctions.getInvoiceDetailsByID)
invoiceRouter.get('/remove/:invoiceNumber',invoiceFunctions.deleteAnInvoice)
invoiceRouter.post('/transaction',invoiceFunctions.makeAnTransaction)
invoiceRouter.get('/dashboard',invoiceFunctions.dashBoardData)
invoiceRouter.post('/report',invoiceFunctions.getReport)



export default invoiceRouter