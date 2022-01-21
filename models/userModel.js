const { firestore, Timestamp, FieldValue } = require('firebase-admin');
const admin = require('../middlewares/firebase.js');

/*
const serviceAccount = require('../../alcancia-developers-firebase-adminsdk-htsct-98ded1e82e.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

*/

const db = firestore();

async function getDesposits(req,res){
    console.log(req.body.uid);
    try {
        let deposits = db.collection('users').doc(`${req.body.uid}`).collection('deposits');
        
        //const doc = await deposits.get();
        const snapshot = await deposits.get();
        snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        });
        if (!doc.exists) {
            return res
            .status(404)
            .send({ error: "No such documet" });
        } else {
            console.log(doc);
            return res
            .status(200)
            .send(doc);
        }
    }catch (e) {
        return res
        .status(500)
        .send({ error: "Error while retriving user" });
        
    }
}

async function addDeposit(req,order,res){
    let orderDetail = order.purchase_units[0].payments.captures[0];
    //Read current balance
    let balance = 0;
    try {
        const userdetail = db.collection('users').doc(`${req.body.uid}`);
        const doc = await userdetail.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            balance = parseInt(doc.data().balance);
        }
        
    }catch (e) {
        return res
        .status(401)
        .send({ error: "Error while retriving user" });
    }
    //update current balance
    try{
         await db.collection('users').doc(`${req.body.uid}`).update({"balance":balance+parseInt(orderDetail.seller_receivable_breakdown.net_amount.value)});
    }catch(e){
        return res
        .status(401)
        .send({ error: "Error while updating user balance" });
    }
    //register new payment
    try {
        console.log(orderDetail.id);
        const userDetail = db.collection('users').doc(`${req.body.uid}`).collection('deposits');
        userDetail.doc(orderDetail.id).set({"create_time":order.create_time,
                                      "id":orderDetail.id,
                                      "payer":order.payer,
                                      "gross_amount":orderDetail.seller_receivable_breakdown.gross_amount.value,
                                      "net_amount":orderDetail.seller_receivable_breakdown.net_amount.value,
                                      "payapal_fee":orderDetail.seller_receivable_breakdown.paypal_fee.value,
                                      "status":orderDetail.status,});
        await addPendingTransaction(req,orderDetail.id,order,res);
    }catch (e) {
        console.log(e);
        return res
        .status(401)
        .send({ error: "Error while registering transaction" });
    }
    return res
        .status(200)
        .send({"create_time":order.create_time,
        "id":orderDetail.id,
        "payer":order.payer,
        "gross_amount":orderDetail.seller_receivable_breakdown.gross_amount.value,
        "net_amount":orderDetail.seller_receivable_breakdown.net_amount.value,
        "payapal_fee":orderDetail.seller_receivable_breakdown.paypal_fee.value});
};


async function addPendingTransaction(req,orderId,order,res){
    try {
        const pendingTransaction = db.collection('pendingTransactions')
        pendingTransaction.doc(orderId).set({
            "date":order.create_time,
            "UID":req.body.uid,
            "name":db.collection('users').doc(`${req.body.uid}`).name+db.collection('users').doc(`${req.body.uid}`).lastName,
            "payer":order.payer,
            "amount":order.purchase_units[0].amount.value,
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