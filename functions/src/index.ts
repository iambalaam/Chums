import * as functions from 'firebase-functions';
import { get, set } from './storage';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest(async (request, response) => {
    const color = request.query.color;

    if (request.path.includes('set')) {
        try {
            await set(request.query);
        } catch (e) {
            response.send(e);
        }
    }

    if (request.path.includes('get')) {
        try {
            const doc = await get();
            return response.send(doc);
        } catch (e) {
            response.send(e);
        }
    }

    return response.send(`
    <html>
        <head><style>
        h1 { color: white; }
        body { background-color: ${color}; }
        </style></head>
        <body><h1>Hello World</h1></body>
    </html>
    `);
});
