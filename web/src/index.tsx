import * as React from 'react';
import { render } from 'react-dom';

import { Member, Player } from '../../functions/src/util/storage';
import { getWeek } from '../../functions/src/util/datetime';

import { getToken, getMember, getCourts, getPlayer } from './api';
import { Nav } from './nav';
import { GameWeekTable } from './game-week-table';
import './index.css';
import { Loading } from './loading';

const WEEKS_TO_SHOW = 2;

export interface AppState {
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

    async componentDidMount() {
        const token = getToken();
        if (token) {
            // Find all distinct courts
            const memberPromise = getMember(token);
            const courtsPromise = getCourts(token);
            const [memberData, courtTimes] = await Promise.all([memberPromise, courtsPromise]);
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
            console.error('Could not authenticate');
        }
    }


    render() {
        const { member, isLoading, courtsByWeek } = this.state;
        return (
            <div id="app">
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