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
        let user = await firestore().collection('users').doc(req.body.uid).get();
        user = user.data();
        if(req.body.amount>user.balance){
            return -1;
        }
        let newBalance = Math.round((user.balance-req.body.amount)*1000)/1000;
        //create pending trans
        let firestoreToday = firestore.Timestamp.now();
        let promisedDay =  firestoreToday.toDate().getDay+3
        await firestore().
                collection('pendingTransactions').
                doc().
                set({
                    "type":"withdraw",
                    "UID": req.body.uid,
                    //"UUID": UUID,
                    "cratedAt": firestoreToday,
                    "promisedDay": promisedDay,
                    "status": "pending",
                    "details": {
                        "amount": req.body.amount,
                        "Country": req.body.country,
                        "bank":req.body.bank,
                        "Account":req.body.account,
                        "oldBalance": user.balance,
                        "newBalance": newBalance,
                    }

                });
        //create userTrans
        await firestore().
                collection('users').
                doc(req.body.uid).
                collection('withdraws').
                add({
                    "userId": req.body.uid,
                    //"uuid": UUID,
                    "cratedAt": firestoreToday,
                    "promisedDay": promisedDay,
                    "status": "pending",
                    "details": {
                        "amount": req.body.amount,
                        "oldBalance": user.balance,
                        "newBalance": newBalance,
                    }
        });
        //subs amount from balance
        await firestore().
                collection('users').
                doc(req.body.uid).
                update({"balance":newBalance,
                "lastDateUpdatedBalance":firestoreToday});
        return res.status(201).send({"UID": req.body.uid,
                            //"UUID": UUID,
                            "cratedAt": firestoreToday,
                            "promisedDay": promisedDay,
                            "status": "pending",
                            "details": {
                                "amount": req.body.amount,
                                "oldBalance": user.balance,
                                "newBalance": newBalance,
                            }
                             });
    }
}