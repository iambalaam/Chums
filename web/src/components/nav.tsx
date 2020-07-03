import * as React from 'react';
import './nav.css';
import { Member } from '../../../functions/src/util/storage';

export interface NavProps {
    member?: Member;
}
export const Nav: React.SFC<NavProps> = ({ member }) => {
    const memberSection = member
        ? <span className="member">{member.FirstName} {member.LastName}</span>
        : null;
    return (
        <nav>
            <span>Chums Tennis</span>
            {memberSection}
        </nav>
    );
};