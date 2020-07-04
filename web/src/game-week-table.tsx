import * as React from 'react';
import { CalendarWithoutTime } from './components/calendar';
import { TimeSlots } from './time-slots';

import './game-week-table.css';
import { CourtWithId } from '../../functions/src/util/storage';

export function GameWeekTable(props: { courts: CourtWithId[]; }) {
    const datesAndCourts: { [date: string]: CourtWithId[]; } = {};
    for (const court of props.courts) {
        // Get the date (without time)
        const d = new Date(court.DateAndTimeOfGame._seconds * 1000);
        d.setHours(0, 0, 0, 0);
        const dateString = d.toISOString();
        // Initialise
        if (!datesAndCourts[dateString]) {
            datesAndCourts[dateString] = [];
        }
        datesAndCourts[dateString].push(court);
    }
    return (
        <table className="game-week-table">
            <tbody>
                {Object.entries(datesAndCourts)
                    .sort(([d1], [d2]) => d1 < d2 ? -1 : 1)
                    .map(([dateString, courts]) => (
                        <tr key={dateString}>
                            <td className="calendar-cell">
                                <CalendarWithoutTime date={new Date(dateString)} />
                            </td>
                            <td>
                                <TimeSlots courts={courts} />
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table >
    );
}