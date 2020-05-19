import { getAuthToken, AuthToken } from './storage';
// import { Request, Response } from 'firebase-functions';

export type Token = string;
export type User = {
    LastName: string;
    EmailAddress: string;
    Gender: 'M' | 'F',
    ContactNumber: string,
    FirstName: string;
};

export const validateEmailTokens = async (emailTokens: string[]): Promise<{ [emailToken: string]: AuthToken; }> => {
    console.log(`Validating email tokens: [${emailTokens.join(', ')}]`);
    const authTokenPromises = emailTokens.map((emailToken) => getAuthToken(emailToken));
    const authTokens = await Promise.all(authTokenPromises);
    console.log(`Got auth tokens: [${authTokens.map((t) => t.DateAndTimeOfGame).join(', ')}]`);

    // check we have at least one token
    const token = authTokens[0];
    if (!token) {
        throw new Error('No auth tokens present');
    }

    // check tokens are for the same user
    for (const authToken of authTokens) {
        if (authToken.MemberId !== token.MemberId) {
            throw new Error('Tokens are for multiple members');
        }
    }

    const keyedAuthTokens: { [emailToken: string]: AuthToken; } = {};
    for (let i = 0; i < emailTokens.length; i++) {
        keyedAuthTokens[emailTokens[i]] = authTokens[i];
    }

    return keyedAuthTokens;
};

export const authenticateUser = async (token: Token): Promise<AuthToken | undefined> => {
    const data = await getAuthToken(token);
    return data;
};