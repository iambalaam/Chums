import * as React from 'react';
import './error-modal.css';
import { UserFacingError } from '../util';

export interface ErrorModalProps {
    err: any;
    dismiss: () => void;
}

export const ErrorModal = ({ err, dismiss }: ErrorModalProps) => {
    if (err) {
        if (err instanceof UserFacingError) {
            return (
                <>
                    <div id="overlay"></div>
                    <div id="modal">
                        <button className="cross" onClick={dismiss}>✕</button>
                        <h2>{err.message}</h2>
                        <p>{err.description}</p>
                        <pre>{err.stack}</pre>
                        {err.help
                            ? <p>{err.help}</p>
                            : <>
                                <p>Some errors can be fixed by refreshing.</p>
                                <button onClick={() => window.location.reload()}>refresh</button>
                            </>}
                    </div>
                </>
            );
        }
        const heading = err.message || '';
        const debug = err.stack || '';
        return (
            <>
                <div id="overlay"></div>
                <div id="modal">
                    <button className="cross" onClick={dismiss}>✕</button>
                    <h2>{heading}</h2>
                    <pre>{debug}</pre>
                    <p>Some errors can be fixed by refreshing.</p>
                    <button onClick={() => window.location.reload()}>refresh</button>
                </div>
            </>
        );
    } else {
        return null;
    }
};