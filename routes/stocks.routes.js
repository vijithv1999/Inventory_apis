// importing the needed modules
import express from 'express'
import { ListStocks, MakeAnTransaction, addStocks, checkAvailability, getDateWiseReport, getIncompleteInvoices, getInvoicesByID, getStockWithQuery, getprodutCode, getprodutCost, saveInvoice } from '../controllers/stocks.controller.js'
import { ValidateStockData } from '../middlewares/stocks.validate.js'

// initailzing Router instance
const Router = express.Router()

Router.post('/add-stocks', ValidateStockData, addStocks)
Router.get('/list-stocks', ListStocks)
Router.get('/search-stock/:key', getStockWithQuery)
Router.post('/save-invoice', saveInvoice)
Router.post('/invoice-transcation', MakeAnTransaction)
Router.get('/invoice-list', getIncompleteInvoices)
Router.get('/get-invoice/:id', getInvoicesByID)
Router.post('/check-availability', checkAvailability)
Router.post('/get-day-report', getDateWiseReport)
Router.post('/get-product-code', getprodutCode)
Router.post('/get-cost-details', getprodutCost)
export default Router



