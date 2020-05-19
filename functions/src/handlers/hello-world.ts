import * as functions from 'firebase-functions';
import { getMember, getOrStorePlayer } from '../util/storage';
import { validateEmailTokens } from '../util/auth';
import { constructPlayer } from '../util/players';
import { render } from '../util/html';



export const helloWorld = functions.https.onRequest(async (req, res) => {
    try {
        const emailTokens = Object.entries(req.body)
            .filter(([_emailToken, toggle]) => toggle === 'on')
            .map(([emailToken, _toggle]) => emailToken);

        const authTokens = await validateEmailTokens(emailTokens);
        const member = await getMember(authTokens[0].MemberId);
        if (!member) {
            throw new Error(`Could not get Member for ${authTokens[0].MemberId}`);
        }

        const players = authTokens.map((authToken) => constructPlayer(member, authToken));
        const playerPromises = emailTokens.map(async (token, i) => {
            return getOrStorePlayer(token, players[i]);
        });
        const playerStatuses = await Promise.all(playerPromises);
        res.send(render(member, players, playerStatuses));

    } catch (err) {
        console.error(err);
        if (err instanceof Error && err.stack) {
            res.send(`<pre>${err.stack}</pre>`);
        } else {
            res.send(err.toString());
        }
    }
});