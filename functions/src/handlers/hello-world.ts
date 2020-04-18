import * as functions from 'firebase-functions';
import fetch, { Response } from 'node-fetch';
import { createDocument } from '../html';

// https://cloud.google.com/functions/docs/securing/authenticating
const REGION = 'us-central1';
const PROJECT = 'chums-test';
const METADATA_SERVER_TOKEN_URL = 'http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=';
const functionURL = (functionName: string) => `https://${REGION}-${PROJECT}.cloudfunctions.net/${functionName}`;

const getTokenForFunction = async (functionName: string) => {
    let response: Response;
    try {
        response = await fetch(
            METADATA_SERVER_TOKEN_URL + functionURL(functionName),
            { headers: { 'Metadata-Flavor': 'Google' } }
        );
        const text = await response.text();
        return text;
    } catch (e) {
        return e;
    }
};

// This will not work on the free tier of cloud functions
// This will make an external http request (disabled until upgrade)
// Concensus online is to refactor to keep all the parts inside common code
// i.e. keep everything to a single function invocation
const callSecureFunction = async (functionName: string) => {
    const token = await (getTokenForFunction(functionName));
    let response;
    try {
        response = await fetch(
            functionURL(functionName) + '/really/long/path',
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const text = await response.text();
        return text;
    } catch (e) {
        return e;
    }
};

export const helloWorld = functions.https.onRequest(async (_req, res) => {
    const something = await callSecureFunction('db');
    res.send(createDocument({ body: '<h1>Hello World</h1>', foot: something }));
});