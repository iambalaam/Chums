import * as React from 'react';
import { CalendarWithoutTime } from './calendar';
import { TimeSlot } from './time-slots';

import './game-week-table.css';

export interface GameWeekTableProps {
    courtTimeDates: Date[];
}
export const GameWeekTable = ({ courtTimeDates: courtTimes }: GameWeekTableProps) => {
    const datesAndTimes: { [date: string]: Date[]; } = {};
    for (const courtTime of courtTimes) {
        // Get the date (without time)
        const d = new Date(courtTime);
        d.setHours(0, 0, 0, 0);
        const dateString = d.toISOString();
        // Initialise
        if (!datesAndTimes[dateString]) {
            datesAndTimes[dateString] = [];
        }
        datesAndTimes[dateString].push(courtTime);
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
                            <ul className="time-slots">
                                {times.map((time) =>
                                    <TimeSlot
                                        key={time.toISOString()}
                                        date={time}
                                        initialStatus=""
                                        add={async () => { }}
                                        remove={async () => { }}
                                    />
                                )}
                            </ul>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table >
    );
};