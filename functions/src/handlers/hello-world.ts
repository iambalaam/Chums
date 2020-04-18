import * as functions from 'firebase-functions';
import { createDocument } from '../html';

export const helloWorld = functions.https.onRequest((_req, res) => {
    res.send(createDocument({ body: '<h1>Hello World</h1>' }));
});