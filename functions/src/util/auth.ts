import * as functions from 'firebase-functions';
import { getAuthToken, getMember } from './storage';

export type Token = string;
export type User = {
    LastName: string;
    EmailAddress: string;
    Gender: 'M' | 'F',
    ContactNumber: string,
    FirstName: string;
};

export const authMiddleware = async (req: functions.https.Request, res: functions.Response) => {
    const queryToken = req.query && req.query.token;
    const headerCookies = (req.headers.cookie || '')
        .split('; ')
        .filter((cookie) => cookie.startsWith('token='));
    const cookieToken = (headerCookies[0] || '').slice(6);

    if (typeof queryToken === 'string' && queryToken.length > 0) {
        const queryAuthToken = await getAuthToken(queryToken);
        if (queryAuthToken) {
            res.setHeader('Set-Cookie', `token=${queryToken}`);
            const member = await getMember(queryAuthToken.MemberId);
            if (member) {
                res.locals.authToken = queryAuthToken;
                res.locals.member = member;
                return;
            }
        }
        console.warn(`invalid query auth token: ${queryToken}`);

    }

    if (typeof cookieToken === 'string' && cookieToken.length > 0) {
        const cookieAuthToken = await getAuthToken(cookieToken);
        if (cookieAuthToken) {
            const member = await getMember(cookieAuthToken.MemberId);
            if (member) {
                res.locals.authToken = cookieAuthToken;
                res.locals.member = member;
            }
            return;
        }
        console.warn(`invalid cookie auth token: ${cookieToken}`);

    }

    throw new Error('Could not authenticate request');

};