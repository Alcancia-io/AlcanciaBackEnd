const express = require('express');
const bodyParser  = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const validator = require('express-validator');
const deposits = require('./routes/deposits.js');
//const users = require('./routes/users');
//const users = require('./routes/users.js');
//import { body, validationResult } from "express-validator";
//const paypal = require('./paypalClient.js');
//import {createOrder,executeOrder,getOrderInfo} from './paypalClient.js';
//const auth = require('./auth.js');
//import {checkIfAuthenticated} from './auth.js';
//const firestore = require('./firebaseClient.js');
//import {addDeposit} from './firestoreClient.js';
//import { apps } from 'firebase-admin';
//const  firebase = require('firebase-admin');
dotenv.config();

//app init
const app = express();

var corsOptions = {
    origin: 'http://localhost:8100',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

//middleware
app.use(cors());
app.use(express.json());
//app.use('/users',users);
app.use('/deposits',deposits);

/*
app.post('/create-order',checkIfAuthenticated,body('amount','currency_code').isFloat({min:20,max:5000}).notEmpty(),async (req,res) =>{
    //TODO: currency code validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }  
    var result=await createOrder(req.body.amount,req.body.currency_code,req.body.UID);
    res.send(result);
});

app.post('/execute-order',checkIfAuthenticated,body('orderToken').notEmpty(),async (req,res)=>{
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
*/
app.listen(process.env.PORT,() => {
    console.log(`Server Running on port: http://localhost:${process.env.PORT}`);
});
