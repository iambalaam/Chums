import './time-slots.css';
import * as React from 'react';

///////////////
// TIME SLOT //
///////////////

export type BookingRequestStatus = 'Requested' | '';
export interface TimeSlotProps {
    time: string;
    initialStatus: BookingRequestStatus;
    add: () => Promise<void>;
    remove: () => Promise<void>;
}
interface TimeSlotState {
    status: BookingRequestStatus;
}

export class TimeSlot extends React.Component<TimeSlotProps, TimeSlotState> {
    constructor(props: TimeSlotProps) {
        super(props);
        this.state = {
            status: props.initialStatus
        };
    }

    handleAdd = async () => {
        try {
            await this.props.add();
            this.setState({ status: 'Requested' });
        } catch (e) {
            console.error(e);
        }
    };

    handleRemove = async () => {
        try {
            await this.props.remove();
            this.setState({ status: '' });
        } catch (e) {
            console.error(e);
        }
    };

    render() {
        const { time } = this.props;
        const { status } = this.state;
        const isRequested = Boolean(status);
        return (
            <li className="time-slot">
                <span className="time">{time}</span>
                <span className="status">{status}</span>
                <span className="actions">
                    <button disabled={isRequested} onClick={this.handleAdd}>+</button>
                    <button disabled={!isRequested} onClick={this.handleRemove}>-</button>
                </span>
            </li>
        );
    }
}

////////////////
// TIME SLOTS //
////////////////
