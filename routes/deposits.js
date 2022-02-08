const express = require('express');
const router = express.Router();
const { param, header, body, validationResult } = require('express-validator');
const {captureOrder,getOrderInfo} = require('../controllers/depositController.js');
const paypalController = require('../controllers/paypalController.js')
const {addDeposit,getDesposits} = require('../models/userModel.js');
const {checkAuth} = require('../middlewares/firebase.js');


router.post(
    '/create-order',
    header('Authorization').not().isEmpty(),
    body('amount').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        return next();
    },
    checkAuth,
    paypalController.createOrder
);


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
router.post(
    '/execute-order',
    /*
    checkAuth,
    async (req,res)=>{
    let order = await captureOrder(req.body.orderToken);
    if(!order){
        return res.status('500').send("Something went wrong");
    }
    let orderDetails = await getOrderInfo(req,order,res);
    let deposit = await addDeposit(req,orderDetails,res);
    return orderDetails;
    */
    //missing check body
    header('Authorization').not().isEmpty(),
    body('orderToken').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        return next();
    },
    checkAuth,
    async (req,res) =>{
        let order = await paypalController.captureOrder(req,res);
        let deposit = await addDeposit(req,order,res);
        /*
        return res.status(201).send({"id": order.purchase_units[0].payments.captures[0].id,
                                    "payer": order.payer,
                                    "gross amount": order.purchase_units[0].payments.captures[0].gross_amount,
                                    "created time": order.purchase_units[0].payments.captures[0].create_time})*/
    }
);
module.exports = router;