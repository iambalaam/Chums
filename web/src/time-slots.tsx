import './time-slots.css';
import * as React from 'react';
import { useState } from 'react';
import { getToken, requestCourt, cancelRequestCourt } from './api';
import { Ball } from './components/loading';
import { CourtWithId } from '../../functions/src/util/storage';

///////////////
// TIME SLOT //
///////////////

export type BookingRequestStatus = 'Requested' | '';
export interface TimeSlotProps {
    date: Date;
    initialStatus: BookingRequestStatus;
}
export function TimeSlot(props: TimeSlotProps) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<BookingRequestStatus>(props.initialStatus);

    const request = async () => {
        setLoading(true);
        const token = getToken();
        if (token) {
            const response = await requestCourt(token, props.date.getTime() / 1000);
            if (response.ok) {
                setStatus('Requested');
                setLoading(false);
            }
        }
    };

    const cancelRequest = async () => {
        setLoading(true);
        const token = getToken();
        if (token) {
            const response = await cancelRequestCourt(token, props.date.getTime() / 1000);
            if (response.ok) {
                setStatus('');
                setLoading(false);
            }
        }
    };

    const isRequested = Boolean(status);
    return (
        <li className="time-slot">
            <span className="time">{props.date.toLocaleString('en-GB', { hour: 'numeric', minute: 'numeric' })}</span>
            <span className="status">{status}</span>
            <span className="actions">
                {isLoading
                    ? <Ball size="small" />
                    : <>
                        <button disabled={isRequested} onClick={request}>+</button>
                        <button disabled={!isRequested} onClick={cancelRequest}>-</button>
                    </>}
            </span>
        </li>
    );
}

////////////////
// TIME SLOTS //
////////////////

interface TimeSlotsProps { courts: CourtWithId[]; }
export function TimeSlots(props: TimeSlotsProps) {
    // Get Distinct courts
    const groupedCourts: { [ms: number]: CourtWithId[]; } = {};
    for (const court of props.courts) {
        const ms = court.DateAndTimeOfGame._seconds * 1000;
        // Initialise
        if (!groupedCourts[ms]) {
            groupedCourts[ms] = [];
        }
        groupedCourts[ms].push(court);
    }
    return <>{
        Object.entries(groupedCourts).map(([ms, _courts]) => {
            // Check if court contains name
            return <TimeSlot date={new Date(parseInt(ms))} initialStatus='' />;
        })
    }</>;

}