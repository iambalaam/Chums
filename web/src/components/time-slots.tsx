import './time-slots.css';
import * as React from 'react';
import { useState, useContext } from 'react';
import { requestCourt, cancelRequestCourt } from '../api';
import { Ball } from './loading';
import { CourtWithId } from '../../../functions/src/util/storage';
import { tokenContext } from '../';

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
    const token = useContext(tokenContext);

    const request = async () => {
        setLoading(true);
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
            return <TimeSlot key={ms} date={new Date(parseInt(ms))} initialStatus='' />;
        })
    }</>;

}