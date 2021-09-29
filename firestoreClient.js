import admin from './firebaseClient.js';
const db = admin.firestore(); 


export const userCreate = async (user,res) => {
    try {
        const usersDb = db.collection('users').doc(user.UID); 
        const result = await usersDb.set({
            "UID": user.UID,
            "name":user.name,
            "lastName":user.lastname,
            "email":user.email,
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