import * as functions from 'firebase-functions';
import { getMember, Player } from '../util/storage';
import { validateEmailTokens } from '../util/auth';
import { constructPlayer } from '../util/players';

export const helloWorld = functions.https.onRequest(async (req, res) => {
    try {
        const emailTokens = Object.entries(req.body)
            .filter(([_emailToken, toggle]) => toggle === 'on')
            .map(([emailToken, _toggle]) => emailToken);
        const keyedAuthTokens = await validateEmailTokens(emailTokens);

        const member = await getMember(keyedAuthTokens[emailTokens[0]].MemberId);

        const keyedPlayers: { [id: string]: Player; } = {};
        Object.entries(keyedAuthTokens).forEach(([key, authToken]) => {
            keyedPlayers[key] = constructPlayer(member, authToken);
        });
        res.send(`<pre>${JSON.stringify(keyedPlayers, null, 4)}</pre>`);
    } catch (err) {
        if (err instanceof Error && err.stack) {
            res.send(err.stack);
        } else {
            res.send(err);
        }
    }
});