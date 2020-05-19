import { getAuthToken, AuthToken } from './storage';

export type Token = string;
export type User = {
    LastName: string;
    EmailAddress: string;
    Gender: 'M' | 'F',
    ContactNumber: string,
    FirstName: string;
};

export const validateEmailTokens = async (emailTokens: string[]): Promise<AuthToken[]> => {
    console.log(`Validating email tokens: [${emailTokens.join(', ')}]`);
    const authTokenPromises = emailTokens.map((emailToken) => getAuthToken(emailToken));
    const authTokens = await Promise.all(authTokenPromises);
    console.log(`Got auth tokens: [${authTokens}`);

    // check we have at least one token
    if (authTokens.length === 0) {
        throw new Error('No auth tokens present');
    }

    // Check all tokens are valid
    for (let i = 0; i < authTokens.length; i++) {
        if (!authTokens[i]) {
            throw new Error(`Failed to get auth token for ${emailTokens[i]}`);
        }
    }

    // check tokens are for the same user
    const token = authTokens[0];
    for (const authToken of authTokens) {
        if (authToken!.MemberId !== token!.MemberId) {
            throw new Error('Tokens are for multiple members');
        }
    }

    return authTokens as AuthToken[];
};