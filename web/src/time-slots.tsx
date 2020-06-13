import './time-slots.css';
import * as React from 'react';
import { getToken, requestCourt, cancelRequestCourt } from './api';
import { Ball } from './loading';
import { Player } from '../../functions/src/util/storage';

///////////////
// TIME SLOT //
///////////////

export type BookingRequestStatus = 'Requested' | 'Booked' | '';
export interface TimeSlotProps {
    date: Date;
    player: Player;
}
interface TimeSlotState {
    isLoading: boolean;
    status: BookingRequestStatus;
}

export class TimeSlot extends React.Component<TimeSlotProps, TimeSlotState> {
    constructor(props: TimeSlotProps) {
        super(props);
        const playerExists = props.player.EmailAddress != undefined;
        const isLocked = Boolean(props.player.CourtNumber);
        let status: BookingRequestStatus = '';
        if (playerExists) {
            status = 'Requested';
        }
        if (isLocked) {
            status = 'Booked';
        }
        this.state = {
            isLoading: false,
            status
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
        const isLocked = status === 'Booked';
        return (
            <li className="time-slot">
                <span className="time">{this.props.date.toLocaleString('en-GB', { hour: 'numeric', minute: 'numeric' })}</span>
                <span className="status">{status}</span>
                <span className="actions">
                    {this.state.isLoading
                        ? <Ball size="small" />
                        : <>
                            <button disabled={isRequested || isLocked} onClick={this.request}>+</button>
                            <button disabled={!isRequested || isLocked} onClick={this.cancelRequest}>-</button>
                        </>}
                </span>
            </li>
        );
    }
}

////////////////
// TIME SLOTS //
////////////////;
