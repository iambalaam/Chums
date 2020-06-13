import * as React from 'react';
import './loading.css';

export interface BallProps { size?: 'normal' | 'small'; }

export const Loading = (props: BallProps) =>
    <div className="loading">
        <Ball {...props} />
    </div>;

export const Ball = (props: BallProps) => <div className={`ball ${props.size || 'normal'}`} />;