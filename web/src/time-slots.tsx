import './time-slots.css';
import * as React from 'react';
import { getToken, requestCourt, cancelRequestCourt, getPlayer } from './api';
import { Ball } from './loading';
import { Player, Member } from '../../functions/src/util/storage';
import { Court } from './court';

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
    times: Date[];
}
interface TimeSlotsState {
    players?: Player[];
}

export class TimeSlots extends React.Component<TimeSlotsProps, TimeSlotsState> {
    constructor(props: TimeSlotsProps) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const sortedTimes = this.props.times.sort();
        const playersPromises = sortedTimes.map((time) => {
            const seconds = time.getTime() / 1000;
            return getPlayer(getToken()!, seconds);
        });

        const players = await Promise.all(playersPromises);

        this.setState({ players });
    }

    render() {
        const { players } = this.state;
        if (!players) return null;

        console.log(players);
        const isBooked = players.some((player) => Boolean(player.CourtNumber));

        if (isBooked) {
            const mockMembers = [
                { FirstName: 'First', LastName: 'Last' },
                { FirstName: 'First', LastName: 'Last' },
                { FirstName: 'First', LastName: 'Last' },
                { FirstName: 'First', LastName: 'Last' }
            ] as Member[];
            return <Court courtNumber={0} members={mockMembers} />;
        } else {
            return this.props.times.map((time, i) => {
                const status = Boolean(players[i].EmailAddress) ? 'Requested' : '';
                return <TimeSlot date={time} initialStatus={status} />;
            });
        }
    }
}