import * as React from 'react';
import { render } from 'react-dom';

import { Member, Player } from '../../functions/src/util/storage';
import { getWeek } from '../../functions/src/util/datetime';

import { getToken, getMember, getCourts, getPlayer } from './api';
import { Nav } from './nav';
import { GameWeekTable } from './game-week-table';
import './index.css';
import { Loading } from './loading';

export interface AppState {
    isLoading: boolean;
    member?: Member;
    courts?: [Date, Player][];
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    async componentDidMount() {
        const token = getToken();
        if (token) {
            const memberPromise = getMember(token);
            const courtsPromise = getCourts(token);

            // Find all distinct courts
            const [memberData, courtTimes] = await Promise.all([memberPromise, courtsPromise]);
            const member = memberData.member as Member;
            const sortedCourtTimes = courtTimes;
            sortedCourtTimes.sort();

            const playerPromises = sortedCourtTimes.map((time) => getPlayer(token, time));
            const players = await Promise.all(playerPromises);

            const courts = sortedCourtTimes.map((time, i) => [new Date(time * 1000), players[i]] as [Date, Player]);

            this.setState({
                isLoading: false,
                member,
                courts
            });
        } else {
            console.error('Could not authenticate');
        }
    }


    render() {
        const { member, isLoading, courts } = this.state;
        return (
            <div id="app">
                <Nav member={member} />
                <div className="container">
                    <main>
                        {isLoading
                            ? <Loading />
                            : <>
                                <h1 className="game-week">Game Week <span className="number">{getWeek(courts![0][0])}</span></h1>
                                <GameWeekTable courts={courts!} />
                            </>}
                    </main>
                </div>
            </div>
        );
    }
}

render(<App />, document.getElementById('root')!);