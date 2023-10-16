import User from "../models/user.modal.js";
import { handleResponse } from "../common/common.functions.js";
import jwt from 'jsonwebtoken'

    const createUser = async (req, res) => {
        try {
            let { confirmPassword, email, name, password ,userType} = req.body
            const userExists = await User.findOne({ email })
            if (userExists) return await handleResponse({ res, code: 400, error:true, message:"Email is alreday taken." })
            else {
                let newUser = new User({
                    email,
                    password,
                    name,
                    userType
                })
                let user = await newUser.save()
                return await handleResponse({ res, code: 201, error: false, message: "Created sucesfully.", data: user })
            }

        } catch (error) {
            console.log(error)
            return await handleResponse({ res })
        }
    }



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return  await handleResponse({res,code:404, error:true,message:"User not found"})
        }
        // Compare passwords
        const passwordMatches = await user.comparePassword(password)
        if (!passwordMatches) {
            return  await handleResponse({res,code:401,error:true,message:"Invalid credentails"})
        }
        // Create a token with user information
        const token = jwt.sign(
            { userId: user._id, email: user.email, name: user.name ,userType:user.userType},
            process.env.JWT_SECRET,
        );
        return await handleResponse({res,code:200,error:false,message:"User verified.",data:{ token, user:{userId: user._id, email: user.email, name: user.name ,userType:user.userType}}})
    } catch (error) {
        console.error(error);
        res.status(200).json({ staus: 500, error: true, message: 'An error occurred' });
    }
}



export { createUser, loginUser}