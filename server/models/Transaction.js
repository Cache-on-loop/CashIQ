import mongoose from "mongoose";
import User from "./User.js";
import Amex from "./Cards.js";

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Amex',
      required: true
    },
    transactionName: {
      type: String,
      required: true,
    },
    vendor: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      default: "None",
    },
    amount: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
