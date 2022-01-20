import admin from './firebaseClient.js';
const db = admin.firestore(); 


export const userCreate = async (user,res) => {
    try {
        const usersDb = db.collection('users').doc(user.UID); 
        const result = await usersDb.set({
            "UID": user.UID,
            "name": user.name,
            "lastName": user.lastname,
            "email" : user.email,
            "accAddress" : user.accAddress,
            "publicKey" : user.publicKey,
            "privateKey" : user.privateKey,
            "mnemonic" : user.mnemonic
        });
    }catch (e) {
        return res
        .status(401)
        .send({ error: "Error while creating user" });
    }

    return res
        .status(201)
        .send(user);
};

export const userDetail = async (user,res) => {
    try {
        const userdetail = db.collection('users').doc(`${user.UID}`);
        const doc = await userdetail.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            user.name = doc.data().name;
            user.lastName = doc.data().lastName;
            user.email = doc.data().email;
            user.balance = doc.data().balance;
        }
        
    }catch (e) {
        return res
        .status(401)
        .send({ error: "Error while retriving user" });
    }
    return res
        .status(201)
        .send(user);
    
};

export const addDeposit = async (userUID,orderId,order,res) => {
    let orderDetail=order.purchase_units[0].payments.captures[0];
    //Read current balance
    let balance = 0;
    try {
        const userdetail = db.collection('users').doc(`${userUID}`);
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
         await db.collection('users').doc(`${userUID}`).set({"balance":balance+parseInt(orderDetail.seller_receivable_breakdown.net_amount.value)});
    }catch(e){
        return res
        .status(401)
        .send({ error: "Error while updating user balance" });
    }
    //register new payment
    try {
        const userDetail = db.collection('users').doc(`${userUID}`).collection('deposits');
        userDetail.doc(orderId).set({"create_time":order.create_time,
                                      "id":orderDetail.id,
                                      "payer":order.payer,
                                      "gross_amount":orderDetail.seller_receivable_breakdown.gross_amount.value,
                                      "net_amount":orderDetail.seller_receivable_breakdown.net_amount.value,
                                      "payapal_fee":orderDetail.seller_receivable_breakdown.paypal_fee.value,
                                      "status":orderDetail.status,});
        await addPendingTransaction(userUID,orderDetail.id,order);
    }catch (e) {
        return res
        .status(401)
        .send({ error: "Error while registering transaction" });
    }
    return res
        .status(200)
        .send("OK");
};

export const addPendingTransaction = async (userUID,orderId,order) => {
    try {
        const pendingTransaction = db.collection('pendingTransactions')
        pendingTransaction.doc(orderId).set({
            "date":order.create_time,
            "UID":userUID,
            "name":db.collection('users').doc(`${userUID}`).name+db.collection('users').doc(`${userUID}`).lastName,
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

