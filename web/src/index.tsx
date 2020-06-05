import * as React from 'react';
import { render } from 'react-dom';
import './index.css';

const App = () => <h1 className="red"> HI</h1 >;

console.log(document.getElementById('root'));

render(<App />, document.getElementById('root')!);