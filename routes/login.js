const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
//const admin = require('../middlewares/firebase.js');

router.post('/', (req, res) => {
    // Get the ID token passed and the CSRF token.
    const idToken = req.body.idToken;
    console.log(idToken);
    const csrfToken = req.csrfToken;
    //console.log(csrfToken);
    // Guard against CSRF attacks.
    if (csrfToken !== req.cookies.XSRF-TOKEN) {
      res.status(401).send('UNAUTHORIZED REQUEST!');
      return;
    }
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.
    getAuth()
      .createSessionCookie(idToken, { expiresIn })
      .then(
        (sessionCookie) => {
          // Set cookie policy for session cookie.
          const options = { maxAge: expiresIn, httpOnly: true, secure: true };
          res.cookie('session', sessionCookie, options);
          res.end(JSON.stringify({ status: 'success' }));
        },
        (error) => {
          res.status(401).send('UNAUTHORIZED REQUEST!');
        }
      );
  });

module.exports = router;