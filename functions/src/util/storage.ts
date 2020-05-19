import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

export type FirebaseTimestamp = {
    _seconds: number,
    _nanoseconds: number;
};

// Authentication token storage
export interface AuthToken {
    MemberId: string,
    ExipryDate: FirebaseTimestamp;
    DateAndTimeOfGame: FirebaseTimestamp;
}

export interface Member {
    ContactNumber: string;
    EmailAddress: string;
    FirstName: string;
    Gender: 'M' | 'F';
    LastName: string;
}

export interface Player {
    CourtNumber: number;
    DateAndTimeOfGame: FirebaseTimestamp;
    EmailAddress: string;
    FirstName: string;
    LastName: string;
    GameWeek: number;
    Position: null;
}

export const getAuthToken = async (token: string): Promise<AuthToken | undefined> => {
    const data = await db
        .collection('EmailAuthTokens')
        .doc(token)
        .get()
        .then((doc) => doc.data() as AuthToken);
    return data;
};

export const getMember = async (memberId: string): Promise<Member | undefined> => {
    const data = await db
        .collection('Members')
        .doc(memberId)
        .get()
        .then((doc) => doc.data() as Member);
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

export const getPlayer = async (playerId: string): Promise<Player | undefined> => {
    const data = db.collection('Players')
        .doc(playerId)
        .get()
        .then((doc) => doc.data() as Player);
    return data;
};

export const storePlayer = async (playerId: string, player: Player) => {
    return db.collection('Players')
        .doc(playerId)
        .set(player);
};

export type DataUpdateStatus = 'Exists' | 'Stored' | 'Failed';
export const getOrStorePlayer = async (playerId: string, player: Player): Promise<DataUpdateStatus> => {
    const storedPlayed = await getPlayer(playerId);
    if (storedPlayed) {
        return 'Exists';
    } else {
        await storePlayer(playerId, player);
        return 'Stored';
    }
};