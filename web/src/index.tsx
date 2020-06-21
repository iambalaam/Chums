import * as React from 'react';
import { render } from 'react-dom';

import { Member } from '../../functions/src/util/storage';
import { getWeek } from '../../functions/src/util/datetime';

import { getToken, getMember, getCourts } from './api';
import { Nav } from './nav';
import { GameWeekTable } from './game-week-table';
import './index.css';
import { Loading } from './loading';
import { ErrorModal } from './error-modal';
import { isError, UserFacingError } from './util';

const WEEKS_TO_SHOW = 2;

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
                const memberPromise = getMember(token);
                const courtsPromise = getCourts(token);
                const [memberData, courtTimes] = await Promise.all([memberPromise, courtsPromise]);
                if (isError(memberData)) throw new UserFacingError(
                    `Couldn't log in`,
                    `token: ${token} is expired or incorrect`,
                    memberData.stack || '',
                    `Click on the link in your most recent email to log in`
                );
                if (isError(courtTimes)) throw new UserFacingError(
                    `Couldn't get court times`,
                    courtTimes.message,
                    courtTimes.stack || '',
                );

                console.log({ memberData, courtTimes });
                const member = memberData.member as Member;

                const courtsByWeek: { [week: number]: Date[]; } = {};
                courtTimes.forEach((time) => {
                    const date = new Date(time * 1000);
                    const week = getWeek(date);
                    if (!courtsByWeek[week]) {
                        courtsByWeek[week] = [];
                    }
                    courtsByWeek[week].push(date);
                });

                this.setState({
                    isLoading: false,
                    member,
                    courtsByWeek
                });
            } else {
                throw new UserFacingError(
                    `Couldn't log in`,
                    `No token was present`,
                    new Error().stack || '',
                    `Click on the link in your most recent email to log in`
                );
            }
        } catch (error) {
            this.setState({ error });
        }
    }


    render() {
        const { member, isLoading, courtsByWeek, error } = this.state;
        return (
            <div id="app">
                <ErrorModal
                    err={error}
                    dismiss={() => this.setState({ error: undefined })}
                />
                <Nav member={member} />
                <div className="container">
                    <main>
                        {isLoading
                            ? <Loading />
                            : <>
                                {Object.entries(courtsByWeek!)
                                    .sort(([week1], [week2]) => parseInt(week2) - parseInt(week1))
                                    .slice(0, WEEKS_TO_SHOW + 1)
                                    .map(([week, dates]) => (
                                        <>
                                            <h1 className="game-week">Game Week <span className="number">{week}</span></h1>
                                            <GameWeekTable dates={dates} />
                                        </>
                                    ))}
                            </>}
                    </main>
                </div>
            </div>
        );
    }
}

render(<App />, document.getElementById('root')!);