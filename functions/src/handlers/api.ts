import * as functions from 'firebase-functions';
import {
    getCourts as getAllCourts,
    getPlayer as getPlayerFromId,
    getPlayers as getAllPlayers,
    Player, storePlayer, Member, AuthToken, FirebaseTimestamp, deletePlayer
} from '../util/storage';
import { getWeek } from '../util/datetime';
import { authMiddleware } from '../util/auth';
import { firestore } from 'firebase-admin';

const ALLOWED_ORIGINS = [
    'http://localhost:8080',
    'https://chums-tennis.web.app'
];

export const api = functions.https.onRequest(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const origin = req.headers.origin as string;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', '*');
    }


    try {
        // Perform authentication
        await authMiddleware(req, res);

        // Handle operation
        switch (req.path) {
            case '/getMember':
                return await getMember(req, res);
            case '/getCourts':
                return await getCourts(req, res);
            case '/getPlayer':
                return await getPlayer(req, res);
            case '/getPlayers':
                return await getPlayers(req, res);
            case '/requestCourt':
                await requestCourt(req, res);
                return;
            case '/cancelRequestCourt':
                await cancelRequestCourt(req, res);
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

const getMember = async (_req: functions.https.Request, res: functions.Response) => {
    return res.send({
        memberId: (res.locals.authToken as AuthToken).MemberId,
        member: (res.locals.member as Member)
    });
};

const getPlayer = async (req: functions.https.Request, res: functions.Response) => {
    if (req.method !== 'GET') throw new Error(`Cannot ${req.method} /api/getPlayer`);
    if (!req.query || typeof req.query.seconds !== 'string') throw new Error(`Missing query seconds`);
    const seconds = parseInt(req.query.seconds);
    if (!seconds) throw new Error(`Missing query seconds is not a number`);

    const authToken: AuthToken = res.locals.authToken;

    return res.send(await getPlayerFromId(`${authToken.MemberId}-${seconds}`) || {});
};

const getPlayers = async (_req: functions.https.Request, res: functions.Response) => {
    return res.send(await getAllPlayers());
};

const getCourts = async (req: functions.https.Request, res: functions.Response) => {
    if (req.method !== 'GET') throw new Error(`Cannot ${req.method} /api/getCourts`);
    const courts = await getAllCourts();

    // Filter by gameweek and distinct times
    const distinctGameSeconds: Set<number> = new Set();
    courts
        .forEach((court) => {
            distinctGameSeconds.add(court.DateAndTimeOfGame._seconds);
        });
    return res.send(Array.from(distinctGameSeconds));
};

const requestCourt = async (req: functions.https.Request, res: functions.Response) => {
    if (req.method !== 'POST') throw new Error(`Cannot ${req.method} /api/requestCourt`);
    const { seconds } = req.body;

    // Check params
    if (typeof seconds !== 'number') throw new Error(`body.seconds is ${typeof seconds}`);

    // Check that court exists
    const courts = await getAllCourts();
    const court = courts.find((c) => c.DateAndTimeOfGame._seconds === seconds);
    if (!court) throw new Error('No available court at given time');

    const authToken: AuthToken = res.locals.authToken;
    const member: Member = res.locals.member;
    const { EmailAddress, FirstName, LastName } = member;

    // Construct player entry
    const player: Player = {
        CourtNumber: 0,
        DateAndTimeOfGame: firestore.Timestamp.fromDate(new Date(seconds * 1000)) as any as FirebaseTimestamp,
        GameWeek: getWeek(new Date(seconds * 1000)),
        Position: null,
        EmailAddress,
        FirstName,
        LastName
    };

    // Store in database
    await storePlayer(`${authToken.MemberId}-${seconds}`, player);
    res.send(200);
};

const cancelRequestCourt = async (req: functions.https.Request, res: functions.Response) => {
    if (req.method !== 'POST') throw new Error(`Cannot ${req.method} /api/requestCourt`);
    const { seconds } = req.body;

    // Check params
    if (typeof seconds !== 'number') throw new Error(`body.seconds is ${typeof seconds}`);

    const authToken: AuthToken = res.locals.authToken;

    await deletePlayer(`${authToken.MemberId}-${seconds}`);
    res.send(200);
};