import mongoose from "mongoose"




let clientSchema = new mongoose.Schema({

    name: String,
    email: { type: String, unique: true },
    mobile: String,
    type: String,
    Date: String
})

export default mongoose.model("client_schemas", clientSchema)