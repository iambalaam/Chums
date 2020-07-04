import * as React from 'react';
import { useState, useEffect } from 'react';
import { render } from 'react-dom';

import { Member } from '../../functions/src/util/storage';

import { getToken, getMember } from './api';
import { Nav } from './components/nav';
import './index.css';
import { ErrorModal } from './components/error-modal';
import { isError, UserFacingError } from './util';
import { BookingRequests } from './booking-requests';

function App() {
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
        <div id="app">
            <ErrorModal
                errors={errors}
                dismiss={clearErrors}
            />
            <Nav member={member} />
            <div className="container">
                <BookingRequests handleError={handleError} />
            </div>
        </div>
    );
}
render(<App />, document.getElementById('root')!);