import mongoose from "mongoose";
import Transaction from "./Transaction.js";
import Amex from "./Cards.js";

const UserSchema = new mongoose.Schema(
  { 
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    city: String,
    state: String,
    country: String,
    phoneNumber: String,
    profilePicture: {
      type: String,
      required: false,
    },
    occupation: String,
    dailySpendingCap: {
      type: Number,
      default: -1,
    },
    monthlySpendingCap: {
      type: Number,
      default: -1,
    },
    yearlySpendingCap: {
      type: Number,
      default: -1,
    },
    monthlyEarning: {
      type: Number,
      default: -1,
    },
    monthlySavingGoals: {
      type: Number,
      default: -1,
    },
    yearlySavingGoals: {
      type: Number,
      default: -1,
    },
  },
  { timestamps: true }
);



const User = mongoose.model("User", UserSchema);
export default User; 
