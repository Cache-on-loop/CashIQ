import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";


/*export const getTransactions = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const transactions = await Transaction.find({
      $or: [
        { amount: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: "i" },
    });
    const noneCategoryTransactions = transactions.filter(transaction => transaction.category === "None");
    const otherCategoryTransactions = transactions.filter(transaction => transaction.category !== "None");
    transactions = [...noneCategoryTransactions, ...otherCategoryTransactions];
    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}; 
*/


export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find transactions by user ID
    let transactions = await Transaction.find({ userId });
    const noneCategoryTransactions = transactions.filter(transaction => transaction.category === "None");
    const otherCategoryTransactions = transactions.filter(transaction => transaction.category !== "None");
    transactions = [...noneCategoryTransactions, ...otherCategoryTransactions];

    res.status(200).json({
      transactions,
    });

   
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



export const addTransactions = async (req, res) => {
  try {
    const { userId, cardId, transactionName, vendor, category,date,amount } = req.body;

    // Create a new transaction instance
    const newTransaction = new Transaction({
      userId: new mongoose.Types.ObjectId(userId),
      cardId: new mongoose.Types.ObjectId(cardId),
      transactionName,
      vendor,
      category,
      date,
      amount
    });

    // Save the transaction to the database
    await newTransaction.save();

    res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTransactions = async (req, res) => {
  try {
    const { transactionId } = req.params; // Get the transaction ID from the request parameters
    const _id=transactionId;
    const { userId, cardId, transactionName, vendor, category, date, amount } = req.body; // Get the updated transaction details from the request body
    
    // Find the transaction by ID and update its fields
    const updatedTransaction = await Transaction.findByIdAndUpdate({_id},{
      userId: new mongoose.Types.ObjectId(userId),
      cardId: new mongoose.Types.ObjectId(cardId),
      transactionName,
      vendor,
      category,
      amount,
      date
    }, { new: true });

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction updated successfully", transaction: updatedTransaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCategoryTransactions = async (req, res) => {
  try {
    const { transactionId } = req.params;
    console.log(transactionId)
    const _id = transactionId;
   
     // Get the transaction ID from the request parameters
    const { category } = req.body; // Get the updated category from the request body

    // Find the transaction by ID and update its category
    const updatedTransaction = await Transaction.findByIdAndUpdate({_id}, { category }, { new: true });

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Category updated successfully", transaction: updatedTransaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const searchTransaction = async (req, res) => {
  try {
    const { field, value } = req.query;

    // Construct the query based on the provided field and value
    const query = {};
    query[field] = { $regex: new RegExp(value, "i") };

    // Search for transactions that match the query
    const transactions = await Transaction.find(query);

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

