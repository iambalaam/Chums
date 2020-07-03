import * as React from 'react';
import './court.css';
import { Member } from '../../../functions/src/util/storage';

export interface CourtProps {
    members: Member[];
    courtNumber: number;
}

export const Court = (props: CourtProps) =>
    <div className="court">
        <div className="tramlines__left">{props.courtNumber}</div>
        <div className="tramlines__right"></div>
        <div className="no-mans-land__top"></div>
        <div className="no-mans-land__bottom"></div>
        {props.members.map((member, index) => (
            <div className={`servicebox__${index}`}>
                <div className="first">{member.FirstName}</div>
                <div className="last">{member.LastName}</div>
            </div>
        ))}
    </div>;