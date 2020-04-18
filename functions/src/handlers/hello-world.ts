import * as functions from 'firebase-functions';
import fetch, { Response } from 'node-fetch';
import { createDocument } from '../html';

// https://cloud.google.com/functions/docs/securing/authenticating
const REGION = 'us-central1';
const PROJECT = 'chums-test';
const METADATA_SERVER_TOKEN_URL = 'http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=';

const getTokenForFunction = async (functionName: string) => {
    const receivingFunctionURL = `https://${REGION}-${PROJECT}.cloudfunctions.net/${functionName}`;
    let response: Response;
    try {
        response = await fetch(
            METADATA_SERVER_TOKEN_URL + receivingFunctionURL,
            { headers: { 'Metadata-Flavor': 'Google' } }
        );
        return response;
    } catch (e) {
        return e;
    }
};

export const helloWorld = functions.https.onRequest(async (_req, res) => {
    const something = await getTokenForFunction('db');
    res.send(createDocument({ body: '<h1>Hello World</h1>', foot: something }));
});