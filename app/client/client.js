import React from 'react';
import ReactDOM from 'react-dom';
import Perf from 'react-addons-perf';
import App from '../components/App/App.jsx';

window.Perf = Perf;

// We don't want to inline this data cos it's HUGE
// We fetch here, but we have already pre-fetched in the <head>
// So it's already at least partially ready
fetch(window.APP_DATA.dataFileName)
.then(response => response.json())
.then(data => {
  ReactDOM.render(<App data={data} />, document.getElementById(`app`));
});
