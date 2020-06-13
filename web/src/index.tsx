import * as React from 'react';
import { render } from 'react-dom';

import { Member } from '../../functions/src/util/storage';
import { getWeek } from '../../functions/src/util/datetime';

import { getToken, getMember, getCourts } from './api';
import { Nav } from './nav';
import { GameWeekTable } from './game-week-table';
import './index.css';
import { Loading } from './loading';

export interface AppState {
    isLoading: boolean;
    member?: Member;
    courtTimes?: number[];
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

            const [memberData, courtTimes] = await Promise.all([memberPromise, courtsPromise]);
            const member = memberData.member as Member;
            this.setState({
                isLoading: false,
                member,
                courtTimes
            });
        } else {
            console.error('Could not authenticate');
        }
    }



    render() {
        const { member, isLoading, courtTimes } = this.state;
        const courtTimeDates = courtTimes?.map((courtTime) => new Date(courtTime * 1000));
        return (
            <div id="app">
                <Nav member={member} />
                <div className="container">
                    <main>
                        {isLoading
                            ? <Loading />
                            : <>
                                <h1 className="game-week">Game Week <span className="number">{getWeek(courtTimeDates![0])}</span></h1>
                                <GameWeekTable courtTimeDates={courtTimeDates!} />
                            </>}
                    </main>
                </div>
            </div>
        );
    }
}

render(<App />, document.getElementById('root')!);