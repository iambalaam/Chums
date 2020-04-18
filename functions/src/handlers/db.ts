import * as functions from 'firebase-functions';

export const db = functions.https.onRequest((req, res) => {
    res.send(req.path);
});