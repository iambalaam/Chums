import * as functions from 'firebase-functions';
import { authenticateRequest } from '../util/auth';
import { getUserById } from '../util/storage';

export const helloWorld = functions.https.onRequest(async (req, res) => {
    const userId = await authenticateRequest(req, res);
    if (userId) {
        const users = await getUserById(userId);
        res.status(200).send(users);
    } else {
        res.sendStatus(403);
    }
});