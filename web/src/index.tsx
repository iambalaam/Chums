import * as React from 'react';
import { render } from 'react-dom';

import { Member } from '../../functions/src/util/storage';

import { getToken, getMember } from './api';
import { Nav } from './nav';
import './index.css';
import { ErrorModal } from './error-modal';
import { isError, UserFacingError } from './util';
import { BookingRequests } from './booking-requests';

export interface AppState {
    error?: any;
    isLoading: boolean;
    member?: Member;
    courtsByWeek?: { [week: number]: Date[]; };
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    attachListeners = () => {
        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && isError(event.reason)) {
                event.preventDefault();
                this.setState({ error: event.reason });
                return false;
            }
        });
    };

    async componentDidMount() {
        this.attachListeners();
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

                this.setState({ member: memberData.member as Member });
            } else {
                throw new UserFacingError(
                    `Couldn't log in`,
                    `No token was present`,
                    new Error().stack || '',
                    `Click on the link in your most recent email to log in`
                );
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError = (error: any) => {
        this.setState({ error });
    };


    render() {
        const { member, error } = this.state;
        return (
            <div id="app">
                <ErrorModal
                    err={error}
                    dismiss={() => this.setState({ error: undefined })}
                />
                <Nav member={member} />
                <div className="container">
                    <BookingRequests handleError={this.handleError} />
                </div>
            </div>
        );
    }
}

render(<App />, document.getElementById('root')!);