const { firestore } = require('firebase-admin');
const userModel = require('../models/user.js');

const milliPerDay = 8.64e+7;
const interestRatePerDay = .15/365

module.exports = class UserController{
    
    
    static async getUser(req,res){
        try{
            let snapshot = await firestore()
                                .collection('users')
                                .doc(req.params.uid)
                                .get();
            if(!snapshot.exists){
                try {
                    firestore().collection('users').doc(req.body.uid).set({
                        "balance":0,
                        "createdAt":Date.now(),
                        "email":req.body.email,
                        "name":"",
                        "userId":req.body.uid
                    });
                    console.log("User created");
                    let snapshot1 = await firestore()
                                .collection('users')
                                .doc(req.params.uid)
                                .get();
                    return res.status(200).send(snapshot.data());
                }catch (e) {
                    console.log(e);
                }
                return res.status(404).send({message:"No such document"});
            }
            let user = snapshot.data();
            return res.status(200).send(user);
        }catch(e){
            return res.status(500).send({message:"Something went wrong"});
        }
    }

    static async getUserBalance(req,res){
        try{
            let snapshot = await firestore()
                                .collection('users')
                                .doc(req.params.uid)
                                .get();
            if(!snapshot.exists){
                return res.status(404).send({message:"No such document"});
            }
            let user = snapshot.data();
            let lastDateUpdatedBalance = Date.UTC(user.lastDateUpdatedBalance.toDate().getFullYear(),
                                                user.lastDateUpdatedBalance.toDate().getMonth()+1,
                                                user.lastDateUpdatedBalance.toDate().getDate());
            let todayDate = new Date();
            let today = Date.UTC(todayDate.getFullYear(),
                                todayDate.getMonth()+1,
                                todayDate.getDate());
            if(lastDateUpdatedBalance != today){
                let deltaTime=(today-lastDateUpdatedBalance)/milliPerDay;
                //saldoActual * euler^((0.15/365)*deltaTime)
                user.balance = Math.round((parseFloat(user.balance)*Math.exp((interestRatePerDay)*deltaTime))* 100) / 100;
                firestore().
                        collection('users').
                        doc(req.params.uid).
                        update({
                                "lastDateUpdatedBalance": firestore.Timestamp.now(),
                                "balance":user.balance});
            }
            return res.status(200).send({balance:user.balance,
                                        lastUpdate:todayDate});
        }catch(e){
            return res.status(500).send({message:"Something went wrong"});
        }
    }

    static async createUser(req,res,next){

    }

    static async updateUser(req,res,next){
        try {
            firestore().collection('users').doc(req.body.uid).update({
                "name":req.body.name,
                "surname":req.body.surname
            });
            console.log("User updated");
            return res.status(200).send({"message":"ok"});
        }catch (e) {
            console.log(e);
        }
        return res.status(404).send({message:"error while updating user"});
    }

    static async deleteUser(req,res,next){

    }

    static async getUserDeposits(req,res){
        try{    
            let snapshot = await firestore()
                                .collection('users')
                                .doc(req.params.uid)
                                .collection('deposits')
                                .orderBy('create_time', 'desc')
                                .get();
            let userDepostis=[];
            snapshot.forEach(doc => {
                userDepostis.push(doc.data());
            });
            let deposits = (JSON.stringify(userDepostis));
            return res.status(200).send(deposits);
        }catch(e){
            return res.status(500).send({message:"Something went wrong"});
        }
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