import * as React from 'react';
import { render } from 'react-dom';
import './index.css';
import { Nav } from './nav';
import { Member } from '../../functions/src/util/storage';

export interface AppState {
    member?: Member;
}

const mockMember: Member = {
    ContactNumber: '',
    EmailAddress: '',
    FirstName: 'Guy',
    LastName: 'Balaam',
    Gender: 'M'
};

class App extends React.Component<{}> {
    async componentDidMount() {
        // fetch data
    }

    render() {
        return (
            <div>
                <Nav member={mockMember} />
            </div>
        );
    }
}


render(<App />, document.getElementById('root')!);