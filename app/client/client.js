import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App/App.jsx';

if (process.env.NODE_ENV !== `production`) {
  window.Perf = require(`react-addons-perf`); // eslint-disable-line global-require
}

// We don't want to inline this data cos it's HUGE
// We fetch here, but we have already pre-fetched in the <head>
// So it's already at least partially ready
fetch(window.APP_DATA.dataFileName)
.then(response => response.json())
.then(data => {
  ReactDOM.render(<App data={data} />, document.getElementById(`app`));
});
