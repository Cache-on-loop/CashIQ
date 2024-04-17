import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";

//data imports

import Product from "./models/Product.js";
import ProductStat from"./models/ProductStat.js";
import {data} from "./data/index.js";
import Transaction from "./models/Transaction.js";
import OverallStat from "./models/OverallStat.js";
import AffiliateStat from "./models/AffiliateStat.js";
import User from "./models/User.js";
import Amex from "./models/Cards.js"; // Adjust the path as needed


/*CONFIGURATION*/

dotenv.config();
const app=express();
app.use(express.json())
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

/*ROUTES*/
app.use("/client", clientRoutes);
app.use('/general', generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales",salesRoutes);

/*MONGOOSE SETUP */
const PORT =5001;
mongoose.connect("mongodb+srv://dummyuser:Abc123456789@dashboard.8f4vjpd.mongodb.net/",{
    useNewUrlParser: true,
    useUnifiedTopology:true,
}).then(()=>{
    app.listen(PORT,()=>console.log(`Server Port  ${PORT}`));
    /* ONLY ADD DATA ONE TIME */
    //User.insertMany(dataUser);
    //Product.insertMany(dataProduct);
    //ProductStat.insertMany
    //(dataProductStat);
    //User.insertMany(data);
    //Amex.insertMany(data);
    //OverallStat.insertMany(dataOverallStat);
    //AffiliateStat.insertMany(dataAffiliateStat);
    /*
Transaction.collection.drop((error, result) => {
  if (error) {
    console.error("Error dropping collection:", error);
  } else {
    console.log("Collection dropped successfully:", result);
    Transaction.insertMany(data).then(()=>{
        console.log("Added Successfully.")
    })
  }
});
    
*/

}).catch((error)=>console.log(`${error} did not connect`));