const express = require('express');
const router = express.Router();
const {captureOrder,getOrderInfo} = require('../controllers/depositController.js');
const {addDeposit,getDesposits} = require('../models/userModel.js');
const {checkAuth} = require('../middlewares/firebase.js');

router.post('/execute-order',checkAuth,async (req,res)=>{
    if(!req.body.orderToken){
        return res.status('422').send("Missing parameters");
    }
    let order = await captureOrder(req.body.orderToken);
    if(!order){
        return res.status('500').send("Something went wrong");
    }
    let orderDetails = await getOrderInfo(req,order,res);
    let deposit = await addDeposit(req,orderDetails,res);
    //let pendingTrans;
    //res.status(200).send(orddepositer);
    return orderDetails;
});

router.get('/index',checkAuth,async (req, res) =>{
    let deposits = await getDesposits(req,res);
    return deposits;
});
module.exports = router;