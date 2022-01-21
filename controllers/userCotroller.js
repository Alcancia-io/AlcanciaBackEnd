const {addDeposit,addPendingTransaction} = require('../models/user.js');

async function createTransaction(req,res){
    try{
        //register deposit in user colletion
        await addDeposit(UID,order);
    }catch(e){
        console.log(e);
    }
}

async function getDesposits(){

}
exports.getDesposits = getDesposits
exports.createTransaction = createTransaction;