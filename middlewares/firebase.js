const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();
const credentials = process.env.SERVICEKEY;

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});


async function checkAuth(req, res, next){
    const headerToken = req.headers.authorization;
    
    if(!headerToken) {
        return res.status(403).send({ message: "Forbidden" });
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
        res.status(401).send({ message: "Could not authorize" });
    };
};
exports.checkAuth = checkAuth;
