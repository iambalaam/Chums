import './time-slots.css';
import * as React from 'react';
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
interface TimeSlotState {
    isLoading: boolean;
    status: BookingRequestStatus;
}

export class TimeSlot extends React.Component<TimeSlotProps, TimeSlotState> {
    constructor(props: TimeSlotProps) {
        super(props);
        this.state = {
            isLoading: false,
            status: props.initialStatus
        };
    }

    request = async () => {
        this.setState({ isLoading: true });
        const token = getToken();
        if (token) {
            const response = await requestCourt(token, this.props.date.getTime() / 1000);
            if (response.ok) {
                this.setState({ isLoading: false, status: 'Requested' });
            }
        }
    };

    cancelRequest = async () => {
        this.setState({ isLoading: true });
        const token = getToken();
        if (token) {
            const response = await cancelRequestCourt(token, this.props.date.getTime() / 1000);
            if (response.ok) {
                this.setState({ isLoading: false, status: '' });
            }
        }
    };

    render() {
        const { status } = this.state;
        const isRequested = Boolean(status);
        return (
            <li className="time-slot">
                <span className="time">{this.props.date.toLocaleString('en-GB', { hour: 'numeric', minute: 'numeric' })}</span>
                <span className="status">{status}</span>
                <span className="actions">
                    {this.state.isLoading
                        ? <Ball size="small" />
                        : <>
                            <button disabled={isRequested} onClick={this.request}>+</button>
                            <button disabled={!isRequested} onClick={this.cancelRequest}>-</button>
                        </>}
                </span>
            </li>
        );
    }
}

////////////////
// TIME SLOTS //
////////////////

interface TimeSlotsProps {
    courts: CourtWithId[];
}

export class TimeSlots extends React.Component<TimeSlotsProps, {}> {
    render() {
        // Get name

        // Get Distinct courts
        const groupedCourts: { [ms: number]: CourtWithId[]; } = {};
        for (const court of this.props.courts) {
            const ms = court.DateAndTimeOfGame._seconds * 1000;
            // Initialise
            if (!groupedCourts[ms]) {
                groupedCourts[ms] = [];
            }
            groupedCourts[ms].push(court);
        }
        return Object.entries(groupedCourts).map(([ms, _courts]) => {
            // Check if court contains name
            return <TimeSlot date={new Date(parseInt(ms))} initialStatus='' />;
        });
    }
}