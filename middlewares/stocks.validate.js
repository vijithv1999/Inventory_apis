import { handleResponse } from '../common/common.functions.js';
import Joi from 'joi';

const ValidateStockData = async (req, res, next) => {
  try {
    const itemSchema = Joi.object({
      name: Joi.string().required(),
      code: Joi.string().required(),
      type: Joi.string(),
      unit: Joi.string().valid('KG', 'PACK', 'NOS',"Service").required(),
      quantity: Joi.number().required(),
      price: Joi.number().required(),
      date: Joi.date().required(),
      serialId: Joi.string().required(),
      totalPrice: Joi.number().required(),
      gst:Joi.optional(),
      isGst:Joi.optional()
    });

    const payloadSchema = Joi.array().items(itemSchema);



    // Validate the payload against the schema
    const { error, value } = payloadSchema.validate(req.body);

    if (error) {
      console.error('Validation error:', error.details);
      return await handleResponse({ res, code: 400, error: true, message: error.message })

    } else {
      console.log('Payload is valid:', value);
      next()

    }

  } catch (error) {
    return await handleResponse({ res, code: 500, error: true, message: error.message })

  }
}

export { ValidateStockData }


