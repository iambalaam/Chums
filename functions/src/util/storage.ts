import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

export const set = (data: any) => db.collection('test-collection').doc('test-doc').set(data);
export const get = () => db.collection('test-collection').doc('test-doc').get();

// Authentication token storage
interface TokenStorage {
    [token: string]: string;
}
export const addNewToken = (username: string, token: string) => {
    return db.collection('auth')
        .doc('user-tokens')
        .update({ [token]: username });
};
export const getUserTokens = async (): Promise<TokenStorage> => {
    const data = await db.collection('auth')
        .doc('user-tokens')
        .get()
        .then((doc) => doc.data() as TokenStorage);
    return data;
};