const { firestore } = require('firebase-admin');
const userModel = require('../models/user.js');


module.exports = class UserController{
    
    
    static async getUser(req,res){
        let snapshot = await firestore().collection('users').doc(req.params.uid).get();
        if(!snapshot.exists){
            return res.status(404).send({message:"No such document"});
        }
        let user = snapshot.data();
        return res.status(200).send(user);
    }

    static async createUser(req,res,next){

    }

    static async updateUser(req,res,next){

    }

    static async deleteUser(req,res,next){

    }

    static async getUserDeposits(req,res){
        let snapshot = await firestore().collection('users').doc(req.params.uid).collection('deposits').orderBy('create_time', 'desc').get();
        let userDepostis=[];
        snapshot.forEach(doc => {
            userDepostis.push(doc.data());
        });
        let deposits = (JSON.stringify(userDepostis));
        return res.status(200).send(deposits);
    }

    /*
    static async bulkUpdate(req,res){
        //create batch
        console.log('Bulkupdate');
        let batch = firestore().batch();
        try{
            let counter =0;
            const usersSnapshot = await firestore().collection('users').get();
            usersSnapshot.forEach(doc => {
                if(doc.get('balance')==undefined){
                    console.log("updating user: "+doc.data().userId);
                    let  userRef = firestore().collection('users').doc(doc.data().userId);
                    batch.update(userRef,{"balance": 0 });
                    counter=counter+1;
                }
            });
            batch.commit();
            console.log("Done, updated "+counter+" user(s)");
            return res.status(200).send({message:"Done, updated "+counter+" user(s)"});
        }catch(e){
            console.log(e);
        }
    }
    */

}

/*
async function createTransaction(req,res){
    try{
        await addDeposit(UID,order);
    }catch(e){
        console.log(e);
    }
}

exports.createTransaction = createTransaction;*/