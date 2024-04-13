import express from "express";
import {getUser,getDashboardStats} from "../controllers/general.js";

const router = express.Router();

router.get("/dashboard",getDashboardStats);
router.get("/user/:id",getUser);

export default router;