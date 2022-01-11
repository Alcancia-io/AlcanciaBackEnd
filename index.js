import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';
import dotenv from "dotenv";
import cors from 'cors';
import { body, validationResult } from "express-validator";
import {createOrder,executeOrder,getOrderInfo} from './paypalClient.js';
import {checkIfAuthenticated} from './auth.js';
import {addDeposit,addPendingTransaction} from './firestoreClient.js';
dotenv.config();
const app = express();


//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
app.use('/users',usersRoutes);

//routes
app.get('/',(req,res) => {
    res.send('Hellow world');
});

app.get('/create-order',checkIfAuthenticated,body('usdAmount').isFloat({min:20,max:500}).notEmpty(),async (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }  
    var result=await createOrder(req.body.usdAmount,req.body.UID);
    res.send(result);
});

app.get('/execute-order',checkIfAuthenticated,body('orderToken').notEmpty(),async (req,res)=>{
    console.log(req.body.orderToken);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }  
    //recive token and PayerID and execute the order
    var order = await executeOrder(req.body.orderToken);
    //get order details
    var retrivedOrderInfo = await getOrderInfo(order);
    //insert order into firestore
    addDeposit(req.body.UID,retrivedOrderInfo.id,retrivedOrderInfo,res);
    //addPendingTransaction(req.body.UID,retrivedOrderInfo.id,retrivedOrderInfo,res);
    //res.send('order exectued');
});

app.get('/cancel-order',(req,res)=>{
    res.send('cancelled');
});

app.listen(process.env.PORT,() => {
    console.log(`Server Running on port: http://localhost:${process.env.PORT}`);
});
