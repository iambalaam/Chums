import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// Authentication token storage
interface TokenStorage {
    [token: string]: string;
}
export const addNewToken = (userId: string, token: string) => {
    return db.collection('auth')
        .doc('user-tokens')
        .update({ [token]: userId });
};
export const getUserTokens = async (): Promise<TokenStorage> => {
    const data = await db.collection('auth')
        .doc('user-tokens')
        .get()
        .then((doc) => doc.data() as TokenStorage);
    return data;
};

// User utilities
export const getUserById = (userId: string) => {
    return db.collection('Members')
        .get()
        .then((querySnapshot) => {
            const userDoc = querySnapshot.docs.filter((doc) => doc.id === userId)[0];
            if (userDoc) {
                return userDoc.data();
            } else {
                return;
            }
        });
};