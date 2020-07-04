import * as React from 'react';
import { useState, useEffect, createContext } from 'react';
import { render } from 'react-dom';

import { Member } from '../../functions/src/util/storage';

import { getToken, getMember } from './api';
import './index.css';
import { isError, UserFacingError } from './util';
import { App } from './app';

// Contexts
export const tokenContext = createContext<string | undefined>(undefined);
export const memberContext = createContext<Member | undefined>(undefined);
export const errorContext = createContext<[any[], (err: any) => void, () => void]>([[], () => { }, () => { }]);

function Root() {
    // Populate Contexts
    const [token, setToken] = useState<string | undefined>();
    useEffect(function setupToken() {
        setToken(getToken());
    }, []);
    const [member, setMember] = useState<Member | undefined>();
    const [errors, setErrors] = useState<any[]>([]);
    function handleError(err: any) {
        console.error(err);
        setErrors(errors.concat(err));
    }
    function clearErrors() { setErrors([]); };

    // Extra error catching
    useEffect(function attachEventListeners() {
        function catchUnhandledRejections(event: PromiseRejectionEvent) {
            if (event.reason && isError(event.reason)) {
                event.preventDefault();
                handleError(event.reason);
                return false;
            }
        }
        window.addEventListener('unhandledrejection', (catchUnhandledRejections));
        return function removeEventListeners() {
            window.removeEventListener('unhandledrejection', catchUnhandledRejections);
        };
    });

    useEffect(function setup() {
        // async iife as outer effect fn must be sync
        (async () => {
            try {
                const token = getToken();
                if (token) {
                    // Find all distinct courts
                    const memberData = await getMember(token);
                    if (isError(memberData)) throw new UserFacingError(
                        `Couldn't log in`,
                        `token: ${token} is expired or incorrect`,
                        memberData.stack || '',
                        `Click on the link in your most recent email to log in`
                    );
                    setMember(memberData.member as Member);
                } else {
                    throw new UserFacingError(
                        `Couldn't log in`,
                        `No token was present`,
                        new Error().stack || '',
                        `Click on the link in your most recent email to log in`
                    );
                }
            } catch (error) {
                handleError(error);
            }
        })();
    }, []);

    return (
        <errorContext.Provider value={[errors, handleError, clearErrors]}>
            <memberContext.Provider value={member}>
                <tokenContext.Provider value={token}>
                    <App />
                </tokenContext.Provider>
            </memberContext.Provider>
        </errorContext.Provider>
    );
}
render(
    <Root />,
    document.getElementById('root')!
);