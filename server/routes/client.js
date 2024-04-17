import express from "express";
import { getProducts, getCustomers, getGeography } from "../controllers/client.js";
import { getTransactions, addTransactions, searchTransactionsByField, updateTransactions, updateCategoryTransactions, getTotalAmountByCategory } from "../controllers/transaction.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions/:userId", getTransactions);
router.get("/transactions/search/:userId", searchTransactionsByField)

//Transaction Routes

router.post("/transactions/add", addTransactions);
router.post("/transactions/update/:transactionId", updateTransactions);
router.post("/transactions/category/:transactionId", updateCategoryTransactions);
router.get("/transactions/total/:userId", getTotalAmountByCategory)

router.get("/geography", getGeography);
export default router;