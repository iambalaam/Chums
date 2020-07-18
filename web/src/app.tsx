import * as React from 'react';
import { useContext } from 'react';
import { ErrorModal } from './components/error-modal';
import { Nav } from './components/nav';
import { CallForChums } from './pages/call-for-chums';
import { errorContext, memberContext, globalsContext } from '.';
import { Players } from './pages/players';

// App must be rendered inside providers.
export function App() {
    const [errors, handleError, clearErrors] = useContext(errorContext);
    const member = useContext(memberContext);
    const globals = useContext(globalsContext);

    return (
        <div id="app">
            <ErrorModal
                errors={errors}
                dismiss={clearErrors}
            />
            <Nav member={member} />
            <div className="container">
                {
                    globals
                        ? globals.CallForChums
                            ? <CallForChums handleError={handleError} />
                            : <Players handleError={handleError} />
                        : null
                }
            </div>
        </div>
    );
}