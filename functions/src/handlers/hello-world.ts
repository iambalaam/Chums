import * as functions from 'firebase-functions';
import { createUserToken, authenticateUser, } from '../util/auth';

export const helloWorld = functions.https.onRequest(async (req, res) => {
    res.write('<html><body>');
    const { newUser, token } = req.query;
    if (typeof newUser === 'string') {
        res.write('<ul>');
        res.write('<li>creating user</li>');
        const t = await createUserToken({ name: newUser });
        res.write(`<li>created user with token: ${t}</li>`);
        res.write('</ul>');
    } else if (typeof token === 'string') {
        const user = await authenticateUser(token);
        res.write(`<h1>${user}</h1>`);
    }
    res.write('</body></html>');
    res.end();
});