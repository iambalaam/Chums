import * as React from 'react';
import './players.css';
import './page.css';

export function Players(props: { handleError: (err: any) => void; }) {
    return (
        <main>
            <div className="description">
                <h1>PLAYERS</h1>
                <p>Say what to do...</p>
            </div>
        </main>
    );
}