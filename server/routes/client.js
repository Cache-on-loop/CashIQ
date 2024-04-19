import express from "express";
import { getProducts, getCustomers, getGeography } from "../controllers/client.js";
import { getTransactions, addTransactions, searchTransactionsByField, updateTransactions, updateCategoryTransactions, getSummary, getdaily, getmonthly } from "../controllers/transaction.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions/:userId", getTransactions);
router.get("/transactions/search/:userId", searchTransactionsByField)

//Transaction Routes

router.post("/transactions/add", addTransactions);
router.post("/transactions/update/:transactionId", updateTransactions);
router.post("/transactions/category/:transactionId", updateCategoryTransactions);
router.get("/transactions/daily/:userId", getdaily);
router.get("/transactions/monthly/:userId", getmonthly);
router.get("/transactions/breakdown/:userId", getSummary);

router.get("/geography", getGeography);
export default router;