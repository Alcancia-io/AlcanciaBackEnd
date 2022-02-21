const { firestore } = require('firebase-admin');
const {randomUUID} = require(crypto);
module.exports = class WithdrawController{
    
    static async doWithdraw(req,uid,amount,country,bank,account,res){
        /*
        switch(country){
            case 'MEX':
                break;
            case 'DOM':
                break;
        }*/
        //check current balance
        user = await firestore().collection('users').doc(req.body.uid).get();
        if(amount>user.balance){
            return -1;
        }
        //create pending trans
        let UUID= randomUUID();
        await firestore().
                collection('pendingTransactions').
                doc(UUID).
                set({
                    "UID": req.body.uid,
                    "UUID": UUID,
                    "cratedAt": firestore.Timestamp.now(),
                    "promisedDay": firestore.Timestamp.now()+3,
                    "status": "pending",
                    "details": {
                        "amount": amount,
                        "Country": country,
                        "bank":bank,
                        "Account":account,
                        "oldBalance": user.balance,
                        "newBalance": user.balance-amount,
                    }

                });
        //create userTrans
        await firestore().collection('users').doc(req.body.uid).collection('withdraws').doc(UUID).set({
                    "UID": req.body.uid,
                    "UUID": UUID,
                    "cratedAt": firestore.Timestamp.now(),
                    "promisedDay": firestore.Timestamp.now()+3,
                    "status": "pending",
                    "details": {
                        "amount": amount,
                        "oldBalance": user.balance,
                        "newBalance": user.balance-amount,
                    }
        });
        //subs amount from balance
        await firestore().collection('users').doc(req.body.uid).update({"balance":user.balance-amount});
    }
}