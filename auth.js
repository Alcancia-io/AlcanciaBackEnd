import admin from './firebaseClient.js';


const getAuthToken = (req, res, next) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      req.authToken = req.headers.authorization.split(' ')[1];
    } else {
      req.authToken = null;
    }
    next();
};

export const checkIfAuthenticated = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;
            const userInfo = await admin.auth().verifyIdToken(authToken);
            req.body.UID = userInfo.uid;
            return next();
        } catch (e) {
            return res
            .status(401)
            .send({ error: "Not a valid user" });
        }
    });
};