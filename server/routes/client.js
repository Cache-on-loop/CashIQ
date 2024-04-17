import express from "express";
import {getProducts,getCustomers,getGeography} from "../controllers/client.js";
import {getTransactions,addTransactions,updateTransactions,updateCategoryTransactions} from "../controllers/transaction.js";

 const router=express.Router();

 router.get("/products",getProducts);
 router.get("/customers",getCustomers);
 router.get("/transactions/:userId",getTransactions);

 //Transaction Routes

 router.post("/transactions/add",addTransactions);
 router.post("/transactions/update",updateTransactions);
 router.post("/transactions/category",updateCategoryTransactions);
 router.get("/geography",getGeography);
 export default router;