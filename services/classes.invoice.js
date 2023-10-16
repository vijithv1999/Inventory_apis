import invoiceSchema from "../models/invoice.model.js"
import Stocks from "../models/stocks.modal.js"
import Sale from "./classes.sales.js"
import moment from "moment"

class Invoice extends Sale {
    constructor({ invoiceNumber, remark, paymentMode, paymentRef }) {
        super({ invoiceNumber })
        this.invoiceNumber = invoiceNumber
        this.details
        this.paymentMode = paymentMode
        this.paymentRef = paymentRef
        this.remark = remark
    }

    Init = async () => {
        try {
            this.details = await invoiceSchema.findOne({ invoiceNumber: this.invoiceNumber })
            return this
        } catch (error) {
            console.log(error)
            throw error
        }
    }
// get akl the invoices for an date
    getInvoice= async(date)=>{
        try {
            let today = (date)? moment(date).format("YYYY/MM/DD"): moment().format("YYYY/MM/DD")
            console.log(today)
            return (await invoiceSchema.find({date:today,isPaymentCompleted:true},{_id:0,products:0}).lean())
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    createAnInvoice = async (invoiceDetails) => {
        try {
            let invoiceNumber = await this.creatUniqueID()
            let new_invoice = { ...invoiceDetails, invoiceNumber }
            let result = await invoiceSchema.create(new_invoice)
            return result.invoiceNumber
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    createInvoiceID = async () => {
        try {
            let uniqueId = await this.creatUniqueID()
            let exist_invoice_number = await invoiceSchema.findOne({ invoiceNumber: uniqueId })
            if (exist_invoice_number) await this.createAnInvoice()
            else return uniqueId
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    creatUniqueID = async (length = 10) => {
        try {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let randomString = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                randomString += characters.charAt(randomIndex);
            }
            return randomString

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    getInvoiceDetails = async () => {
        try {
            for (const product of this.details.products) {
                let productDetails = await Stocks.findOne({ code: product.code }, { availableQuantity: 1 });
                product.isAvailable = (productDetails && productDetails.availableQuantity > product.quantity);
            }
            return this;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    makeAnTransaction = async () => {
        try {
            await Promise.all(this.details.products.map(async (item) => {
                let stock = await Stocks.findOne({ code: item.code })
                stock.availableQuantity = (item.type === "Service") ? item.availableQuantity : parseFloat(stock.availableQuantity) - parseFloat(item.quantity)
                stock.save()
            }))
            this.details.isPaymentCompleted = true
            this.details.paymentMode = this.paymentMode
            this.details.paymentRef = this.paymentRef
            this.details.remark = this.remark
            this.details.transactionId = this.details.invoiceNumber
            let resp = this.details.save()
            await this.createAnSale(this.details.products)
            return resp

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    getTotalSale = async () => {
        try {

            let result = await invoiceSchema.aggregate([
                {
                    $match: { isPaymentCompleted: true },
                },
                {
                    $group: {
                        _id: null,
                        totalCompletedPayments: { $sum: '$totalPrice' },
                    },
                },
            ])
            if (result.length === 0) return 0
            else return result[0].totalCompletedPayments

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    getAdaySale = async (date) => {
        try {
            let today = moment().startOf("day").format('YYYY/MM/DD');
            console.log(today)
            let result = await invoiceSchema.aggregate([
                {
                    $match: {
                        isPaymentCompleted: true,
                        date: date,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalForTheDay: { $sum: '$totalPrice' },
                    },
                },
            ])

            console.log(result)

            if (result.length === 0) return 0
            else return result[0].totalForTheDay
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default Invoice