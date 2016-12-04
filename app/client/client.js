import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App.jsx';
import Perf from 'react-addons-perf';

window.Perf = Perf;

const data = window.APP_DATA;

ReactDOM.render(<App data={data} />, document.getElementById(`app`));
