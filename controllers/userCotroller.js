const {addDeposit,addPendingTransaction} = require('../models/user.js');

async function createTransaction(req,res){
    try{
        await addDeposit(UID,order);
    }catch(e){
        console.log(e);
    }
}

exports.createTransaction = createTransaction;