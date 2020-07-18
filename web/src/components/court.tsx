import * as React from 'react';
import './court.css';

export interface CourtProps {
    members: string[];
    courtNumber: number;
}

export const Court = (props: CourtProps) =>
    <div className="court">
        <div className="tramlines__left">{props.courtNumber}</div>
        <div className="tramlines__right"></div>
        <div className="no-mans-land__top"></div>
        <div className="no-mans-land__bottom"></div>
        {props.members.map((member, index) => {
            const [first, last] = member.split(/\s+/);
            return (
                <div className={`servicebox__${index}`}>
                    <div className="first">{first}</div>
                    <div className="last">{last}</div>
                </div>
            );
        }
        )}
    </div>;