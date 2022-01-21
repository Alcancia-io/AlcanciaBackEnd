const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();
const credentials = require('../../alcancia-developers-firebase-adminsdk-htsct-98ded1e82e.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});


async function checkAuth(req, res, next){
    const headerToken = req.headers.authorization;
    
    if(!headerToken) {
        return res.status(422).send({ message: "No token provided" }).status(401);
    }

    if(headerToken && headerToken.split(" ")[0] !== "Bearer") {
        res.send({ message: "Invalid token" }).status(401);
    }
 
    const token = headerToken.split(" ")[1];
    try{
        let userInfo = await admin.auth().verifyIdToken(token);
        req.body.uid = userInfo.uid;
        return next();
    }catch(e){
        res.status(403).send({ message: "Could not authorize" });
    };
};

exports.checkAuth = checkAuth;
exports.admin = admin;