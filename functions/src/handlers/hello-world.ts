import * as functions from 'firebase-functions';
import { authenticateRequest } from '../util/auth';

export const helloWorld = functions.https.onRequest(async (req, res) => {
    const username = await authenticateRequest(req, res);
    if (username) {
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }

});