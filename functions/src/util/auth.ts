import { addNewToken, getUserTokens } from './storage';

export type Token = string;
export type User = { name: string; };
export type TokenStorage = { [name: string]: Token; };

export const createUserToken = async (user: User): Promise<Token> => {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    try {
        await addNewToken(user.name, token);
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