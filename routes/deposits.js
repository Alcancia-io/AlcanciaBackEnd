const express = require('express');
const router = express.Router();
const {captureOrder,getOrderInfo} = require('../controllers/depositController.js');
const {addDeposit,getDesposits} = require('../models/userModel.js');
const {checkAuth} = require('../middlewares/firebase.js');


/**
 * @swagger
 * /api/deposits/execute-order:
 *  post:
 *      summary: Excute order
 *      tags:
 *          - deposits
 *      description: capture a paypal order and its corresponding database registration
 *      responses:
 *          '401':
 *              description: Unauthorized
 *          '403':
 *              description: Forbiden
 *          '5XX':
 *              description: Unexpected error, internal server error.
 */
router.post('/execute-order',checkAuth,async (req,res)=>{
    let order = await captureOrder(req.body.orderToken);
    if(!order){
        return res.status('500').send("Something went wrong");
    }
    let orderDetails = await getOrderInfo(req,order,res);
    let deposit = await addDeposit(req,orderDetails,res);
    return orderDetails;
});

router.get('/index',checkAuth,async (req, res) =>{
    let deposits = await getDesposits(req,res);
    return deposits;
});
module.exports = router;