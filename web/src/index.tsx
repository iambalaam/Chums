import * as React from 'react';
import { render } from 'react-dom';
import './index.css';
import { CalendarWithTime, CalendarProps } from './calendar';

const mockProps: CalendarProps = {
    date: new Date(),
    status: {
        color: '#5ccd5c',
        message: '✔ Requested'
    }
};

const App = () =>
    <div>
        <CalendarWithTime {...mockProps} />
    </div>;

render(<App />, document.getElementById('root')!);