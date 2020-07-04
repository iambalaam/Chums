import * as React from 'react';
import './loading.css';

export interface BallProps { size?: 'normal' | 'small'; }

export function Loading(props: BallProps) {
    return (
        <div className="loading">
            <Ball {...props} />
        </div>
    );
}

export function Ball(props: BallProps) { return <div className={`ball ${props.size || 'normal'}`} />; };