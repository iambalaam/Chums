import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import './players.css';
import './page.css';
import { tokenContext } from '..';
import { getCourts } from '../api';
import { CourtWithId } from '../../../functions/src/util/storage';
import { Loading } from '../components/loading';

function getCourtsToShow(courts: CourtWithId[]) {
    let courtsByWeek: { [week: number]: { seconds: number, courts: CourtWithId[]; }; } = {};
    for (const court of courts) {
        if (
            court.Player1 != null &&
            court.Player2 != null &&
            court.Player3 != null &&
            court.Player4 != null
        ) {
            if (courtsByWeek[court.GameWeek] == undefined) {
                courtsByWeek[court.GameWeek] = {
                    seconds: court.DateAndTimeOfGame._seconds,
                    courts: []
                };
            }
            courtsByWeek[court.GameWeek].courts.push(court);
        }
    }
    let mostRecentWeek = -1;
    let mostRecentSeconds = -1;
    Object.entries(courtsByWeek).forEach(([week, { seconds }]) => {
        if (seconds > mostRecentSeconds) {
            mostRecentWeek = parseInt(week);
            mostRecentSeconds = seconds;
        }
    });
    if (mostRecentWeek == -1) {
        throw new Error('Cannot find courts to show');
    }
    return courtsByWeek[mostRecentWeek].courts;
}

export function Players(props: { handleError: (err: any) => void; }) {
    const token = useContext(tokenContext);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [courts, setCourts] = useState<CourtWithId[]>();

    useEffect(function setup() {
        if (token) {
            // async iife as outer effect fn must be sync
            (async () => {
                try {
                    const courts = await getCourts(token);
                    const courtsToShow = getCourtsToShow(courts);
                    setCourts(courtsToShow);
                    setLoading(false);
                } catch (err) {
                    props.handleError(err);
                }
            })();
        }
    }, [token]);

    return (
        <main>
            <div className="description">
                <h1>PLAYERS</h1>
                <p>Say what to do...</p>
            </div>
            {
                isLoading
                    ? <Loading />
                    : <pre>{JSON.stringify(courts, null, 4)}</pre>
            }
        </main>
    );
}