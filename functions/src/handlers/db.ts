import * as functions from 'firebase-functions';

export const db = functions.https.onRequest((req, res) => {
    const [, operation] = req.path.slice(1).split('/');
    res.send(operation);
});