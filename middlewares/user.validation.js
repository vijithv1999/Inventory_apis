import Joi from "joi";
import { handleResponse } from "../common/common.functions.js";

const userValidation = async (req, res, next) => {
    try {
        
        const userschema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().optional(),
            userType:Joi.string().valid('admin',"user")
        })
    
        let { error, result } = userschema.validate(req.body)
        if (error)  return await handleResponse({res,code:400,error:true,message:error.message})
        else {
            next()
        }
    } catch (error) {
        await handleResponse({res,code:400,error:true,message:error.message})
    }
}

const repoValidation = async (req, res, next) => {
    const reposchema = Joi.object({
        id: Joi.string().required(),
        userId: Joi.string().required(),
        avatar_url: Joi.string().required(),
        name: Joi.string().required(),
        id: Joi.string().required(),
        description: Joi.string().required(),
        html_url: Joi.string().required(),
        login: Joi.string().required()
        // date:  Joi.string().required()  
    })

    let { error, result } = reposchema.validate(req.body)

    if (error) return res.status(200).json({ error: true, message: error.message, data: {} })
    else {
        next()
    }
}

// common function to valdiate the reposs data
const validateArrayObjects = async (array) => {
    const requiredKeys = ['avatar_url', 'description', 'html_url', 'id', 'login', 'name'];

    for (let i = 0; i < array.length; i++) {
        console.log(i)
        const obj = array[i];

        if (!requiredKeys.every(key => obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== undefined && obj[key] !== '')) {
            const missingKey = requiredKeys.find(key => !obj.hasOwnProperty(key));
            const invalidValueKey = requiredKeys.find(key => obj[key] === null || obj[key] === undefined || obj[key] === '');

            return {
                index: i,
                message: (missingKey) ? `null or undefined not accepted  : ${missingKey} ` : ` invalid key :${invalidValueKey}`,
                isValid: false
            };
        }
    }
    return { isValid: true };
}

const reposValidattion = async (req, res, next) => {
    try {
        console.log(req.data)
        let valid = await validateArrayObjects(req.data)
        console.log(valid)
        if (valid.isValid) next()
        else res.status(200).json({ status: 400, error: true, message: valid.message })
    } catch (error) {
        console.log(error)
        res.status(200).json({ staus: 500, error: true, message: 'An error occurred' });

    }

}

export { userValidation, repoValidation, reposValidattion }