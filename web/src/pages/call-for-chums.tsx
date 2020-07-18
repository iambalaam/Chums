import * as React from 'react';
import { useState, useEffect } from 'react';
import './page.css';
import { getCourts } from '../api';
import { getWeek } from '../../../functions/src/util/datetime';
import { Loading } from '../components/loading';
import { GameWeekTable } from '../game-week-table';
import { UserFacingError, isError } from '../util';
import { CourtWithId } from '../../../functions/src/util/storage';
import { tokenContext } from '..';
import { GameWeekHeader } from '../components/game-week-header';

export type CourtsByWeek = { [week: number]: CourtWithId[]; } | undefined;
export function CallForChums(props: { handleError: (err: any) => void; }) {
    const [isLoading, setLoading] = useState(true);
    const [courtsByWeek, setCourtsByWeek] = useState<CourtsByWeek>();
    const token = React.useContext(tokenContext);

    useEffect(function setup() {
        if (token) {
            // async iife as outer effect fn must be sync
            (async () => {
                try {
                    const courtTimes = await getCourts(token);
                    if (isError(courtTimes)) throw new UserFacingError(
                        `Couldn't get court times`,
                        courtTimes.message,
                        courtTimes.stack || '',
                    );

                    const courtsByWeek: { [week: number]: CourtWithId[]; } = {};
                    courtTimes.forEach((court) => {
                        const date = new Date(court.DateAndTimeOfGame._seconds * 1000);
                        const week = getWeek(date);
                        if (!courtsByWeek[week]) {
                            courtsByWeek[week] = [];
                        }
                        courtsByWeek[week].push(court);
                    });
                    setCourtsByWeek(courtsByWeek);
                    setLoading(false);
                } catch (error) {
                    props.handleError(error);
                }
            })();
        }
    }, [token]);

    return (
        <main>
            <div className="description">
                <h1>CALL FOR CHUMS</h1>
                <p>Say what to do...</p>
            </div>
            {isLoading
                ? <Loading />
                : <>
                    {Object.entries(courtsByWeek!)
                        .sort(([week1], [week2]) => parseInt(week2) - parseInt(week1))
                        .slice(0, 1)
                        .map(([week, courts]) => (
                            <React.Fragment key={week}>
                                <GameWeekHeader week={week} />
                                <GameWeekTable courts={courts} />
                            </React.Fragment>
                        ))}
                </>}
        </main>
    );
}