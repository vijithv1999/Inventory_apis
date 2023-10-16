import express from "express"
import { createUser, loginUser } from "../controllers/user.controller.js"
import { userValidation, repoValidation, reposValidattion } from "../middlewares/user.validation.js"

const router = express.Router()

router.post('/signup', userValidation, createUser)
router.post('/login', loginUser)




export default router