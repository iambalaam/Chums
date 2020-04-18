import { addNewToken, getUserTokens } from './storage';
import { Request, Response } from 'firebase-functions';

export type Token = string;
export type User = {
    LastName: string;
    EmailAddress: string;
    Gender: 'M' | 'F',
    ContactNumber: string,
    FirstName: string;
};
export type TokenStorage = { [name: string]: Token; };

export const authenticateRequest = async (req: Request, res: Response): Promise<string | undefined> => {
    // Does the user have a new token?
    const queryStringToken = req.query.token;
    if (typeof queryStringToken === 'string') {
        const userId = await authenticateUser(queryStringToken);
        if (userId) {
            res.setHeader('Set-Cookie', `token=${queryStringToken}`);
            return userId;
        }
    }

    // Does the user have a cookie?
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
        const cookies = cookieHeader.split('; ');
        const cookieToken = cookies
            .map((cookie) => cookie.split('='))
            .filter(([key, value]) => key === 'token')[0][1];
        if (cookieToken) {
            const userId = await authenticateUser(cookieToken);
            if (userId) {
                return userId;
            }
        }
    }

    // Not authenticated
    return;
};

export const createUserToken = async (userId: string): Promise<Token> => {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    try {
        await addNewToken(userId, token);
        return token;
    } catch (e) {
        throw new Error('Could not add token to database');
    }
};

export const authenticateUser = async (token: Token): Promise<string | undefined> => {
    const data = await getUserTokens();
    const matches = Object.entries(data)
        .filter(([t, n]) => t === token);
    if (matches.length > 0) {
        return matches[0][1];
    } else {
        return;
    }
};