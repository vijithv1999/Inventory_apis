import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userschema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  userType:String,
});

// Hash the password before saving it to the database
userschema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// Define the comparePassword method
userschema.method("comparePassword", async function (candidatePassword) {
  try {
    console.log(candidatePassword,this.password)
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
});

const User = mongoose.model("user_schemas", userschema);

export default User;
