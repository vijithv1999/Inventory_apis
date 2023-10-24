import stockSchema from "../models/stocks.modal.js";
import { handleResponse } from "../common/common.functions.js";
import Invoice from "../models/invoice.model.js";
import Sale from "../services/classes.sales.js";
import Stock from "../services/classes.stocks.js";

//creating n new stock  batch
const addStocks = async (req, res) => {
  try {
    const stocksData = req.body;

    // Loop through the incoming stocks data
    for (const stock of stocksData) {
      const existingStock = await stockSchema.findOne({
        code: stock.id,
        serialId: stock.serialId,
        price: stock.price
      });

      if (existingStock) {
        // If the stock already exists, update its data
        existingStock.totalPrice += stock.totalPrice;
        existingStock.quantity += stock.quantity;
        existingStock.availableQuantity += stock.quantity;
        existingStock.updatedDate = stock.date
        await existingStock.save();
      } else {
        stock.availableQuantity = (stock.unit.toUpperCase() === "SERVICE") ? 1 : stock.quantity
        stock.updatedDate = stock.date
        console.log(stock)

        // If the stock doesn't exist, create a new entry
        await stockSchema.create(stock);
      }
    }

    return await handleResponse({
      res,
      code: 201,
      error: false,
      message: "Created Successfully",
      data: stocksData,
    });
  } catch (error) {
    console.error(error);
    return await handleResponse({
      res,
      code: 500,
      error: true,
      message: "Internal server error",
      data: [],
    });
  }
};

//lsting the stocks
const ListStocks = async (req, res) => {
  try {
    let stocksList = await stockSchema.find({}, { _id: 0 })
    return await handleResponse({ res, code: 200, error: false, message: "Stock List", data: stocksList })

  } catch (error) {
    console.log(error)
    return await handleResponse({ res, code: 500, error: true, message: "Internal server error", data: [] })
  }
}
//search the stock
const getStockWithQuery = async (req, res) => {
  try {
    const { key } = req.params; // Get the key from the query parameters

    // Define the query conditions
    const query = {
      $and: [
        { $or: [{ name: { $regex: key, $options: 'i' } }, { id: { $regex: key, $options: 'i' } }] }, // Match name or id with the key (case-insensitive)
        { availableQuantity: { $gt: 0 } }, // availableQuantity greater than zero
      ],
    };
    // Use the find method to retrieve matching documents
    const matchedStocks = await stockSchema.find(query);

    if (matchedStocks.length === 0) {
      return handleResponse({
        res, code: 404,
        error: true,
        message: 'No matching items found',
        data: [],
      });
    }

    return handleResponse({
      res,
      code: 200,
      error: false,
      message: 'Matching items retrieved successfully',
      data: matchedStocks,
    });
  } catch (error) {
    console.error(error);
    return handleResponse({
      res,
      code: 500,
      error: true,
      message: 'Internal server error',
      data: [],
    });
  }
};


//create an invoice for the stock


const saveInvoice = async (req, res) => {
  try {
    // Extract data from the request body
    let {
      invoiceNumber,
      customerName,
      mobileNumber,
      products,
      totalPrice,
      remark,
      paymentMode,
      paymentRef,
      isPaymentCompleted,
      user
    } = req.body;
    invoiceNumber = invoiceNumber || await generateUniqueId()
    let invoice = await Invoice.findOneAndUpdate({ invoiceNumber: invoiceNumber }, {
      invoiceNumber,
      customerName,
      mobileNumber,
      products,
      totalPrice,
      remark,
      paymentMode,
      paymentRef,
      isPaymentCompleted,
      user
    }, { new: true, upsert: true })

    return handleResponse({
      res,
      code: 201, // Created status code
      error: false,
      message: 'Invoice saved successfully',
      data: invoice.invoiceNumber,
    });
  } catch (error) {
    console.error(error);
    return handleResponse({
      res,
      code: 500,
      error: true,
      message: 'Internal server error',
      data: null,
    });
  }
};

const getIncompleteInvoices = async (req, res) => {

  try {
    let invoices = await Invoice.find({ isPaymentCompleted: false }, { _id: 0, products: 0 })
    return handleResponse({
      res,
      code: 201, // Created status code
      error: false,
      message: 'Invoice saved successfully',
      data: invoices,
    });

  } catch (error) {
    console.error(error);
    return handleResponse({
      res,
      code: 500,
      error: true,
      message: 'Internal server error',
      data: null,
    });
  }
}


const MakeAnTransaction = async (req, res) => {
  try {
    let { invoiceNumber } = req.body
    let sale = new Sale({ invoiceNumber, date: new Date() })
    let invoice = await Invoice.findOneAndUpdate({ invoiceNumber }, req.body, { new: true })
    if (invoice) {
      let { products } = req.body
      for (const product of products) {
        const { id, quantity, serialId } = product;

        // Find the product by id and update its available quantity
        // Assuming you have a Product model defined similarly to the ProductSchema
        const existingProduct = await stockSchema.findOne({ id, serialId });

        if (!existingProduct) {
          return handleResponse({
            res,
            code: 404,
            error: true,
            message: `Product with ID ${id} not found`,
            data: null,
          });
        }

        if (existingProduct.quantity < quantity) {
          return handleResponse({
            res,
            code: 400,
            error: true,
            message: `Insufficient quantity for product with ID ${id}`,
            data: null,
          });
        }
        existingProduct.availableQuantity -= quantity;
        await existingProduct.save();
      }
      await sale.createAnSale(products)
    }
    return handleResponse({
      res,
      code: 201, // Created status code
      error: false,
      message: 'Transaction successful',
      data: [],
    });

  } catch (error) {
    console.error(error);
    return handleResponse({
      res,
      code: 500,
      error: true,
      message: 'Internal server error',
      data: null,
    });
  }
}

const getInvoicesByID = async (req, res) => {

  try {
    let { id } = req.params
    let invoices = await Invoice.find({ invoiceNumber: id }, { _id: 0 })
    return handleResponse({
      res,
      code: 201, // Created status code
      error: false,
      message: 'Invoice saved successfully',
      data: invoices,
    });

  } catch (error) {
    console.error(error);
    return handleResponse({
      res,
      code: 500,
      error: true,
      message: 'Internal server error',
      data: null,
    });
  }
}


async function checkAvailability(req, res) {
  try {
    let { id, quantity } = req.body
    let stock = new Stock(id)
    await stock.Init()
    if (await stock.checkAvailabilty(quantity)) {
      let gstAmount = await stock.calulateGst(quantity)
      return handleResponse({ res, code: 200, error: false, message: "Stock available.", data: { status: true, gstAmount: gstAmount } })

    }
    else return handleResponse({ res, code: 200, error: false, message: "Not avialble.", data: { status: false, gstAmount: 0 } })
  } catch (error) {
    console.error(error);
    return handleResponse({
      res,
      code: 500,
      error: true,
      message: 'Internal server error',
      data: null,
    });
  }
}

async function getDateWiseReport(req, res) {
  try {

    let { date } = req.body
    let sale = new Sale({ date: date })
    let report = await sale.getADayReport()
    return handleResponse({
      res, code: 200,
      error: false,
      message: 'Report.',
      data: report,
    });

  } catch (error) {
    console.error(error);
    return handleResponse({
      res,
      code: 500,
      error: true,
      message: 'Internal server error',
      data: null,
    });
  }
}

async function getprodutCode(req, res) {
  try {

    let stock = new Stock({})
    let code = await stock.creatProductCode(req.body.name)
    return handleResponse({ res, code: 200, error: false, message: 'code', data: code });
  } catch (error) {
    console.error(error);
    return handleResponse({ res, code: 500, error: true, message: 'Internal server error', data: null });
  }
}


let getprodutCost = async (req, res) => {
  try {
    let { code, unit } = req.body
    let stock = new Stock(code)
    await stock.Init()
    let cost = await stock.productCost(unit)
    console.log(cost)
    return handleResponse({ res, code: 200, error: false, message: 'code', data: cost });

  } catch (error) {
    console.error(error);
    return handleResponse({ res, code: 500, error: true, message: 'Internal server error', data: null });
  }
}




async function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomNumber = Math.floor(Math.random() * 1000); // You can adjust the range as needed
  const uniqueId = `${timestamp}-${randomNumber}`;
  const existingInvoice = await Invoice.findOne({ invoiceNumber: uniqueId });
  if (existingInvoice) {
    return generateUniqueId();
  }
  return uniqueId;
}





export { addStocks, ListStocks, getStockWithQuery, saveInvoice, getIncompleteInvoices, getInvoicesByID, MakeAnTransaction, checkAvailability, getDateWiseReport, getprodutCode, getprodutCost }