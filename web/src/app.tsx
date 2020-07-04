import * as React from 'react';
import { useContext } from 'react';
import { ErrorModal } from './components/error-modal';
import { Nav } from './components/nav';
import { BookingRequests } from './booking-requests';
import { errorContext, memberContext } from '.';

// App must be rendered inside providers.
export function App() {
    const [errors, handleError, clearErrors] = useContext(errorContext);
    const member = useContext(memberContext);

    return (
        <div id="app">
            <ErrorModal
                errors={errors}
                dismiss={clearErrors}
            />
            <Nav member={member} />
            <div className="container">
                <BookingRequests handleError={handleError} />
            </div>
        </div>
    );
}