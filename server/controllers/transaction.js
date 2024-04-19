import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
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
    const { userId, cardId, transactionName, vendor, category, date, amount } = req.body;

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
    const _id = transactionId;
    const { userId, cardId, transactionName, vendor, category, date, amount } = req.body; // Get the updated transaction details from the request body

    // Find the transaction by ID and update its fields
    const updatedTransaction = await Transaction.findByIdAndUpdate({ _id }, {
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

export const getTotalAmountByCategory = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId });
    const categoryTotals = {};

    transactions.forEach((transaction) => {
      const { category, amount } = transaction;
      // If category is not already in categoryTotals, initialize it to 0
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      // Add transaction amount to total for the category
      categoryTotals[category] += amount;
    });
    res.status(200).json(categoryTotals);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, value } = req.query;
    if (!type && !value) {
      return getTotalAmountByCategory(req, res);
    }

    // Validate the type parameter (assuming it can only be 'monthly', 'yearly', or 'daily')
    if (!['monthly', 'yearly', 'daily'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type parameter' });
    }

    // Define the date range based on the provided type and value
    let startDate, endDate;
    switch (type) {
      case 'monthly':
        startDate = new Date(value);
        endDate = new Date(value);
        endDate.setMonth(endDate.getMonth() + 1); // Increment by 1 month
        break;
      case 'yearly':
        startDate = new Date(value);
        endDate = new Date(value);
        endDate.setFullYear(endDate.getFullYear() + 1); // Increment by 1 year
        break;
      case 'daily':
        startDate = new Date(value);
        endDate = new Date(value);
        endDate.setDate(endDate.getDate() + 1); // Increment by 1 day
        break;
      default:
        break;
    }

    // Filter transactions based on userId and date range
    const transactions = await Transaction.find({ userId, date: { $gte: startDate, $lt: endDate } });

    // Group transactions by category and calculate total amount for each category
    const summary = transactions.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});

    res.status(200).json({ summary });
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
    const updatedTransaction = await Transaction.findByIdAndUpdate({ _id }, { category }, { new: true });

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Category updated successfully", transaction: updatedTransaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



export const searchTransactionsByField = async (req, res) => {
  try {
    const { userId } = req.params;
    const { field, value } = req.query;

    if (!field || !value) {
      return res.status(400).json({ message: 'Field and value parameters are required' });
    }
    const transactions = await Transaction.find({ userId, [field]: value });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// GET /client/transactions/group-by-date
export const getdaily = async (req, res) => {
 try {
    const { userId } = req.params;
    // Extract start date and end date from query parameters
    let { startDate, endDate } = req.query;

    // Validate start date and end date
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" });
    }
    startDate=startDate+"T00:00:00";
    endDate=endDate+"T23:59:59";
    // Convert start date and end date strings to Date objects
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Find transactions within the specified date range
    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDateObj, $lte: endDateObj }
    });

    // Group transactions by date
    const groupedTransactions = transactions.reduce((acc, transaction) => {
      const date = transaction.date.toISOString().split('T')[0]; // Extract date in YYYY-MM-DD format
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction.amount);
      return acc;
    }, {});

    // Calculate total amount for each date
    const result = {};
    for (const [date, amounts] of Object.entries(groupedTransactions)) {
      const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
      result[date] = totalAmount;
    }

    res.status(200).json({ groupedTransactions: result });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getmonthly = async (req, res) =>{
  try {
    const { userId } = req.params;
    const { year } = req.query;

    // Parse the year from the query parameter
    const parsedYear = parseInt(year);

    // Validate the year
    if (isNaN(parsedYear)) {
      return res.status(400).json({ message: "Invalid year parameter" });
    }

    // Define the start and end dates for each month of the specified year
    const months = [];
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(parsedYear, month, 1, 0, 0, 0);
      const endDate = new Date(parsedYear, month + 1, 0, 23, 59, 59);
      months.push({ startDate, endDate });
    }

    // Fetch transactions for the specified user and year
    const transactions = await Transaction.find({
      userId,
      date: { $gte: new Date(parsedYear, 0, 1), $lte: new Date(parsedYear, 11, 31, 23, 59, 59) }
    });

    // Group transactions by month and calculate total expenditure for each month
    const monthlyExpenditure = months.map(month => {
      const { startDate, endDate } = month;
      const totalAmount = transactions.reduce((acc, transaction) => {
        if (transaction.date >= startDate && transaction.date <= endDate) {
          acc += transaction.amount;
        }
        return acc;
      }, 0);
      console.log({ month: startDate.toLocaleString('default', { month: 'long' }), totalAmount })
      return { month: startDate.toLocaleString('default', { month: 'long' }), totalAmount };
    });

    // Fetch user details
    const _id=userId;
    const user = await User.findById(_id);

    // Calculate monthly savings for each month
    const monthlySavings = monthlyExpenditure.map(month => {
      const { totalAmount } = month;
      const monthlySaving = user.monthlyEarning - totalAmount;
      return { ...month, monthlySaving };
    });

    // Prepare response
    const response = {
      monthlySavings,
      monthlySpendingCap: user.monthlySpendingCap,
      monthlyEarnings: user.monthlyEarning,
      monthlySavingGoals: user.monthlySavingGoals
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};





