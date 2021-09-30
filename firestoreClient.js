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