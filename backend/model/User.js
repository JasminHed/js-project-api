import crypto from "crypto";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex")
  }
});

const User = mongoose.model("User", userSchema);

export default User;