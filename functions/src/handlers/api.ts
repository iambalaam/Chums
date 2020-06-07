import * as functions from 'firebase-functions';
import { getCourts as getAllCourts, Player, storePlayer, Member, AuthToken, FirebaseTimestamp } from '../util/storage';
import { getWeek } from '../util/datetime';
import { authMiddleware } from '../util/auth';
import { firestore } from 'firebase-admin';

export const api = functions.https.onRequest(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        // Perform authentication
        await authMiddleware(req, res);

        // Handle operation
        switch (req.path) {
            case '/getCourts':
                return await getCourts(req, res);
            case '/requestCourt':
                await requestCourt(req, res);
                return;
            default:
                throw new Error('404');
        }
    } catch (err) {
        if (err instanceof Error) {
            return res.send({
                name: err.name,
                message: err.message,
                stack: err.stack
            });
        } else {
            return res.send(err);
        }
    }
});

const getCourts = async (req: functions.https.Request, res: functions.Response) => {
    if (req.method !== 'GET') throw new Error(`Cannot ${req.method} /api/getCourts`);
    const courts = await getAllCourts();

    // Find most recent courts
    let newestGameWeek = 0;
    for (const court of courts) {
        if (court.GameWeek > newestGameWeek) newestGameWeek = court.GameWeek;
    }

    // Filter by gameweek and distinct times
    const distinctGameSeconds: Set<number> = new Set();
    courts
        .filter(court => court.GameWeek === newestGameWeek)
        .forEach((court) => {
            distinctGameSeconds.add(court.DateAndTimeOfGame._seconds);
        });
    return res.send(Array.from(distinctGameSeconds));
};

const requestCourt = async (req: functions.https.Request, res: functions.Response) => {
    if (req.method !== 'POST') throw new Error(`Cannot ${req.method} /api/requestCourt`);
    const { seconds } = req.body;

    // Check params
    if (typeof seconds !== 'string') throw new Error(`body.seconds is ${typeof seconds}`);

    // Check that court exists
    const courts = await getAllCourts();
    const court = courts.find((c) => c.DateAndTimeOfGame._seconds === parseInt(seconds));
    if (!court) throw new Error('No available court at given time');

    const authToken: AuthToken = res.locals.authToken;
    const member: Member = res.locals.member;
    const { EmailAddress, FirstName, LastName } = member;

    // Construct player entry
    const player: Player = {
        CourtNumber: 0,
        DateAndTimeOfGame: firestore.Timestamp.fromDate(new Date(parseInt(seconds) * 1000)) as any as FirebaseTimestamp,
        GameWeek: getWeek(new Date(parseInt(seconds) * 1000)),
        Position: null,
        EmailAddress,
        FirstName,
        LastName
    };

    // Store in database
    await storePlayer(`${authToken.MemberId}-${seconds}`, player);
    res.send(200);
};