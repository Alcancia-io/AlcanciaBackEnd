const admin = require('../middlewares/firebase.js');
const { firestore } = require('firebase-admin');

const db = firestore();


async function getDesposits(req,res){
    try {
        let deposits = db.collection('users').doc(`${req.body.uid}`).collection('deposits');
        const snapshot = await deposits.get();
        let userDepostis=[];
        snapshot.forEach(doc => {
            userDepostis.push(doc.data());
        });
        let result = (JSON.stringify(userDepostis));
        return res.status(200).send(result);
    }catch (e) {
        return res
        .status(500)
        .send({ error: "Error while retriving user"});
        
    }
}

async function addDeposit(req,order,res){
    let orderDetail = order.purchase_units[0].payments.captures[0];
    //Read current balance
    let balance = 0;
    try {
        console.log(req.body.uid)
        const userdetail = db.collection('users').doc(`${req.body.uid}`);
        const doc = await userdetail.get();
        console.log(req.body.uid)
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            console.log(doc.data())
            balance = parseInt(doc.data().balance);
            console.log(balance)
        }
        
    }catch (e) {
        return res
        .status(401)
        .send({ error: e });
    }
    //update current balance
    try{
         await db.collection('users').doc(`${req.body.uid}`).update({"balance":balance+parseInt(orderDetail.seller_receivable_breakdown.gross_amount.value)});
    }catch(e){
        return res
        .status(401)
        .send({ error: "Error while updating user balance" });
    }
    //register new payment
    
    try {
        console.log('before regis');
        const userDetail = db.collection('users').doc(`${req.body.uid}`).collection('deposits');
        userDetail.doc(orderDetail.id).set({"create_time":orderDetail.create_time,
                                      "id":orderDetail.id,
                                      "payer":order.payer,
                                      "paypal_id":order.id,
                                      "gross_amount":orderDetail.seller_receivable_breakdown.gross_amount.value,
                                      "net_amount":orderDetail.seller_receivable_breakdown.net_amount.value,
                                      "payapal_fee":orderDetail.seller_receivable_breakdown.paypal_fee.value,
                                      "status":orderDetail.status,});
                                      console.log('after');
                                      await addPendingTransaction(req,orderDetail.id,order,res);
    }catch (e) {
        return res
        .status(401)
        .send({ error: "Error while registering transaction" });
    }
    return res
        .status(200)
        .send({"create_time":orderDetail.create_time,
        "id":orderDetail.id,
        "payer":order.payer,
        "gross_amount":orderDetail.seller_receivable_breakdown.gross_amount.value,});
};


async function addPendingTransaction(req,orderId,order,res){
    try {
        const pendingTransaction = db.collection('pendingTransactions')
        console.log(order);
        pendingTransaction.doc(orderId).set({
            "id":orderId,
            "date":order.purchase_units[0].payments.captures[0].create_time,
            "UID":req.body.uid,
            "name":db.collection('users').doc(`${req.body.uid}`).name+db.collection('users').doc(`${req.body.uid}`).lastName,
            "payer":order.payer,
            "amount":order.purchase_units[0].payments.captures[0].amount.value,
            "target Asset":"USDT",
            "status":"pending",
            "teller":"",
            "completion_date":""
        });
    }catch (e) {
        console.log(e);
    }
};


exports.getDesposits = getDesposits;
exports.addDeposit = addDeposit;
exports.addPendingTransaction = addPendingTransaction;