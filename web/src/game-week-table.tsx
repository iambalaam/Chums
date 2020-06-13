import * as React from 'react';
import { CalendarWithoutTime } from './calendar';
import { TimeSlot, TimeSlots } from './time-slots';

import './game-week-table.css';

export interface GameWeekTableProps {
    dates: Date[];
}
export const GameWeekTable = ({ dates }: GameWeekTableProps) => {
    const datesAndTimes: { [date: string]: Date[]; } = {};
    for (const date of dates) {
        // Get the date (without time)
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const dateString = d.toISOString();
        // Initialise
        if (!datesAndTimes[dateString]) {
            datesAndTimes[dateString] = [];
        }
        datesAndTimes[dateString].push(date);
        datesAndTimes[dateString].sort();
    }
    return (
        <table className="game-week-table">
            <tbody>
                {Object.entries(datesAndTimes).map(([dateString, times]) => (
                    <tr key={dateString}>
                        <td className="calendar-cell">
                            <CalendarWithoutTime date={new Date(dateString)} />
                        </td>
                        <td>
                            <TimeSlots times={times} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table >
    );
};