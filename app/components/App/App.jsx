// import React from 'react';
import { h, Component } from 'preact';
/** @jsx h */

import SkillTable from '../SkillTable/SkillTable.jsx';

if (process.env.IMPORT_SCSS) require(`./App.scss`); // eslint-disable-line global-require

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      stats: [],
    };
  }

  render() {
    return (
      <div id="app">
        <header className="header">
          <h1 className="header__title">Know It All 3</h1>
          <p style={{ color: `white` }}>T: {new Date().toString()}</p>

          <a
            href="https://hackernoon.com/what-you-dont-know-about-web-development-d7d631f5d468#.ex2yp6d64"
            target="_blank"
            rel="noopener noreferrer"
            className="header__help"
            title={`Find out more about know it all, version ${this.props.version}`}
          >What is this?</a>
        </header>

        <SkillTable {...this.state} />
      </div>
    );
  }
}

// App.propTypes = {
//   data: React.PropTypes.array,
//   version: React.PropTypes.string,
// };

export default App;
