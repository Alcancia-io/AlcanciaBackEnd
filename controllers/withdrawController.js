const { firestore } = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
module.exports = class WithdrawController{
    
    static async doWithdraw(req,res){
        /*
        switch(country){
            case 'MEX':
                break;
            case 'DOM':
                break;
        }*/
        //check current balance
        console.log(12);
        let user = await firestore().collection('users').doc(req.body.uid).get();
        user = user.data();
        if(req.body.amount>user.balance){
            return -1;
        }
        //create pending trans
        let UUID= uuidv4();
        await firestore().
                collection('pendingTransactions').
                doc(UUID).
                set({
                    "type":"withdraw",
                    "UID": req.body.uid,
                    "UUID": UUID,
                    "cratedAt": firestore.Timestamp.now(),
                    "promisedDay": firestore.Timestamp.now()+3,
                    "status": "pending",
                    "details": {
                        "amount": req.body.amount,
                        "Country": req.body.country,
                        "bank":req.body.bank,
                        "Account":req.body.account,
                        "oldBalance": user.balance,
                        "newBalance": user.balance-req.body.amount,
                    }

                });
                console.log(1);
        //create userTrans
        await firestore().collection('users').doc(req.body.uid).collection('withdraws').doc(UUID).set({
                    "UID": req.body.uid,
                    "UUID": UUID,
                    "cratedAt": firestore.Timestamp.now(),
                    //"promisedDay": firestore.Timestamp.now()+3,
                    "status": "pending",
                    "details": {
                        "amount": req.body.amount,
                        "oldBalance": user.balance,
                        "newBalance": user.balance-req.body.amount,
                    }
        });
        console.log(2);
        //subs amount from balance
        await firestore().collection('users').doc(req.body.uid).update({"balance":user.balance-req.body.amount,
                                                                        "lastDateUpdatedBalance":firestore.Timestamp.now()});
console.log(3);
        return res.status(201).send({"UID": req.body.uid,
                            "UUID": UUID,
                            "cratedAt": firestore.Timestamp.now(),
                            //"promisedDay": firestore.Timestamp.now()+3,
                            "status": "pending",
                            "details": {
                                "amount": req.body.amount,
                                "oldBalance": user.balance,
                                "newBalance": user.balance-req.body.amount,
                            }
                             });
    }
}