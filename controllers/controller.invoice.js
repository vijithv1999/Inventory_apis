import { handleResponse } from "../common/common.functions.js";
import Invoice from "../services/classes.invoice.js";
import InvoiceSchema from "../models/invoice.model.js";




let invoiceFunctions = {

    createanInvoice: async (req, res) => {
        try {
            let invoiceDetails = req.body
            const invoice = new Invoice({});
            let invoiceNumber = await invoice.createAnInvoice(invoiceDetails)
            await handleResponse({ res, code: 200, message: "INVOICE ADDED.", error: false })
        } catch (error) {
            console.log(error)
            await handleResponse({ res, code: 500, message: "INTERNAL SERVER ERROR", error: true })
        }
    },

    getInvoiceDetailsByID: async (req, res) => {
        try {
            let { id } = req.params
            let invoice = new Invoice({ invoiceNumber: id })
            await (await invoice.Init()).getInvoiceDetails()
            if (invoice.details) await handleResponse({ res, code: 200, message: "INVOICE DETAILS.", data: [invoice.details], error: false })
            else await handleResponse({ res, code: 400, message: "NOT FOUND.", data: [], error: true })
        } catch (error) {
            console.log(error)
            await handleResponse({ res, code: 500, message: "INTERNAL SERVER ERROR", error: true })
        }
    },
    deleteAnInvoice: async (req, res) => {
        try {
            let { invoiceNumber } = req.params
            await InvoiceSchema.findOneAndDelete({ invoiceNumber })
            await handleResponse({ res, code: 200, message: "REMOVED SUCCESSFULLY.", data: [], error: false })
        } catch (error) {
            console.log(error)
            await handleResponse({ res, code: 500, message: "INTERNAL SERVER ERROR", error: true })
        }
    }
    ,
    makeAnTransaction: async (req, res) => {
        try {
            let { invoiceNumber, remark, paymentRef, paymentMode } = req.body
            let invoice = new Invoice({ invoiceNumber, remark, paymentRef, paymentMode })
            await invoice.Init()
            let resp = await invoice.makeAnTransaction()
            await handleResponse({ res, code: 200, message: "SUCCESS.", data: { transactinId: resp.transactionId }, error: false })
        } catch (error) {
            console.log(error)
            await handleResponse({ res, code: 500, message: "INTERNAL SERVER ERROR", error: true })
        }
    },

    dashBoardData: async (req, res) => {
        try {
            let invoice = new Invoice({})
            let [day, overall] = await Promise.all([invoice.getAdaySale(), invoice.getTotalSale()])
            let respnse = [
                {
                    title: "sale",
                    name: "Opening Balance",
                    amount: parseFloat(overall) - parseFloat(day)
                },
                {
                    title: "sale",
                    name: "Today's Sale",
                    amount: parseFloat(day)
                },
                {
                    title: "sale",
                    name: "Overall Balance",
                    amount: parseFloat(overall)
                }
            ]
            await handleResponse({ res, code: 200, message: "SUCCESS.", data: respnse, error: false })

        } catch (error) {
            console.log(error)
            await handleResponse({ res, code: 500, message: "INTERNAL SERVER ERROR", error: true })
        }

    },
    //get dail report
    getReport: async (req, res) => {
        try {
            let invoice = new Invoice({})
            let saleReport = await invoice.getInvoice()
            await handleResponse({ res, code: 200, message: "SUCCESS.", data: saleReport, error: false })

        } catch (error) {
            console.log(error)
            await handleResponse({ res, code: 500, message: "INTERNAL SERVER ERROR", error: true })
        }
    }

}

export default invoiceFunctions

