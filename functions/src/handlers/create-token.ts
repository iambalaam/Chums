import * as functions from 'firebase-functions';
import { createUserToken } from '../util/auth';

export const createToken = functions.https.onRequest(async (req, res) => {
    const userId = req.query.user;
    if (typeof userId === 'string') {
        const token = await createUserToken(userId);
        return res.send(token);
    } else {
        return res.status(400).send('Could not find user in query string');
    }
});