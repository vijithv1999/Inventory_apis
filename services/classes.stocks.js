import stocksSchema from "../models/stocks.modal.js"
import productSchema from "../models/products.model.js"
class Stock {
    constructor(productCode) {
        this.productCode = productCode
        this.product
    }

    Init = async () => {
        try {
            this.product = await stocksSchema.findOne({ code: this.productCode }).lean()
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    checkAvailabilty = async (quantity) => {
        try {
            if (this.product.unit === "Service") return true
            else return parseFloat(this.product.availableQuantity) >= parseFloat(quantity)
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    getProductCode = async (name) => {
        try {
            name = name.toUpperCase()
            const products = await productSchema.findOne({ name }, { _id: 0, name: 1, code: 1 })
            if (products) {
                return products
            } else {
                let newProduct = {
                    name,
                    code: await this.creatProductCode(name)
                }
                let resp = await productSchema.create(newProduct)
                return resp
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    creatProductCode = async (name) => {
        try {
            const timestamp = new Date().toISOString().replace(/[-T:]/g, "").slice(0, 5);
            const combinedResult = `${name.slice(0, 3).toUpperCase()}${timestamp}`;
            let exist = await productSchema.findOne({ code: combinedResult })
            if (exist) await this.creatProductCode()
            else return combinedResult
        } catch (error) {
            console.log(error)
            throw error
        }
    }


}


export default Stock