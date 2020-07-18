import * as React from 'react';
import './game-week-header.css';

export function GameWeekHeader({ week }: { week: string; }) {
    return <h1 className="game-week">Game Week <span className="number">{week}</span></h1>;
}