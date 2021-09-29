
import admin from 'firebase-admin';


admin.initializeApp({
    credential: admin.credential.cert('../coin-test-6f419-firebase-adminsdk-a79n1-057635f522.json')
  });
export default admin;