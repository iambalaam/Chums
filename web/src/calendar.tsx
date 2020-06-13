import * as React from 'react';
import './calendar.css';

export interface CalendarProps {
    date: Date;
    status?: {
        color: string;
        message: string;
    };
}

export const CalendarWithTime: React.SFC<CalendarProps> = ({ date, status }) => {
    const statusProps = status
        ? { style: { color: status.color }, 'data-status': status.message }
        : {};
    const className = status
        ? 'calendar status'
        : 'calendar';
    return (
        <div className={className} {...statusProps}>
            <div className="header">{date.toLocaleDateString('en-GB', { weekday: 'long' })}</div>
            <div className="body">
                <div className="month">{date.toLocaleDateString('en-GB', { month: 'long' })}</div>
                <div className="date">{date.getDate()}</div>
                <div className="time">{date.toLocaleString('en-GB', { hour12: true, hour: 'numeric', minute: 'numeric' })}</div>
            </div>
        </div>
    );
};

export const CalendarWithoutTime: React.SFC<CalendarProps> = ({ date }) => {
    return (
        <div className="calendar">
            <div className="header">{date.toLocaleDateString('en-GB', { weekday: 'long' })}</div>
            <div className="body">
                <div className="month">{date.toLocaleDateString('en-GB', { month: 'long' })}</div>
                <div className="date">{date.getDate()}</div>
            </div>
        </div>
    );
};