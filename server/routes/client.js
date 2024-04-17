import express from "express";
import { getProducts, getCustomers, getGeography } from "../controllers/client.js";
import { getTransactions, addTransactions, updateTransactions, updateCategoryTransactions, getTotalAmountByCategory } from "../controllers/transaction.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions/:userId", getTransactions);

//Transaction Routes

router.post("/transactions/add", addTransactions);
router.post("/transactions/update/:transactionId", updateTransactions);
router.post("/transactions/category/:transactionId", updateCategoryTransactions);
router.get("/transactions/total/:userId", getTotalAmountByCategory)
router.get("/geography", getGeography);
export default router;