import * as React from 'react';
import { render } from 'react-dom';

import { Member } from '../../functions/src/util/storage';

import { getMember } from './api';
import { Nav } from './nav';
import './index.css';

export interface AppState {
    member?: Member;
}

const getToken = (): string | undefined => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryToken = searchParams.get('token');
    if (queryToken) {
        document.cookie = `token=${queryToken}`;
        return queryToken;
    } else {
        const cookies = document.cookie.split('; ');
        const cookieToken = cookies.find((cookie) => cookie.startsWith('token='));
        return cookieToken;
    }
};

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const token = getToken();
        if (token) {
            const data = await getMember(token) || {};
            const member = data.member as Member;
            this.setState({ member });
        } else {
            console.error('Could not authenticate');
        }
    }

    render() {
        return (
            <div>
                <Nav member={this.state.member} />
            </div>
        );
    }
}

render(<App />, document.getElementById('root')!);