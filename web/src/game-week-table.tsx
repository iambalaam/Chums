import * as React from 'react';
import { CalendarWithoutTime } from './calendar';
import { TimeSlot } from './time-slots';

import './game-week-table.css';
import { Player } from '../../functions/src/util/storage';

export interface GameWeekTableProps {
    courts: [Date, Player][];
}
export const GameWeekTable = ({ courts }: GameWeekTableProps) => {
    const datesAndTimes: { [date: string]: [Date, Player][]; } = {};
    for (const [date, player] of courts) {
        // Get the date (without time)
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const dateString = d.toISOString();
        // Initialise
        if (!datesAndTimes[dateString]) {
            datesAndTimes[dateString] = [];
        }
        datesAndTimes[dateString].push([date, player]);
        datesAndTimes[dateString].sort();
    }
    return (
        <table className="game-week-table">
            <tbody>
                {Object.entries(datesAndTimes).map(([dateString, courts]) => (
                    <tr key={dateString}>
                        <td className="calendar-cell">
                            <CalendarWithoutTime date={new Date(dateString)} />
                        </td>
                        <td>
                            <ul className="time-slots">
                                {courts.map((court) =>
                                    <TimeSlot
                                        key={court[0].toISOString()}
                                        date={court[0]}
                                        player={court[1]}
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