const { firestore } = require('firebase-admin');

module.exports = class WithdrawController{
    
    static async doWithdraw(uid,amount,country,bankAccount){
        switch(country){
            case 'MEX':
                break;
            case 'DOM':
                break;
        }
        //check current balance
        user = await firestore().collection('users').doc(uid).get();
        
        if(amount>user.balance){
            return -1;
        }
        //create pending trans
        //missing id for withdraw op
        await firestore.collection('users').doc('users').doc(uid).collection('withdraws').doc('');
        //subs amount from balance
    }
}