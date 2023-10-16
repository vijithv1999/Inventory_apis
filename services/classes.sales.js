import moment from "moment"
import Sales from "../models/sale.model.js"

class Sale {
    constructor({ invoiceNumber, date }) {
        this.date = date
        this.invoiceNumber = invoiceNumber
    }
    // this method expecting array of products to add to the sales list
    createAnSale = async (product) => {
        try {
            let salesProducts = await Promise.all(product.map(item => {
                item = JSON.parse(JSON.stringify(item))
                item.Date = moment(this.date).format("YYYY-MM-DD")
                item.invoiceNumber = this.invoiceNumber
                item.transactionId = this.invoiceNumber
                return item
            }))
            console.log(salesProducts)
            let response = await Sales.create(salesProducts)
            return response
        } catch (error) {
            console.log(error)
            throw error
        }
    }


    getADayReport = async () => {
        try {
            let date = moment(this.date).format("YYYY-MM-DD")
            let saleData = await Sales.find({ Date: date }, { _id: 0 }).lean()
            return saleData
        } catch (error) {
            console.log(error)
            throw error
        }
    }

}

export default Sale