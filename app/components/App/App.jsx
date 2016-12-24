import { h, Component } from 'preact'; /** @jsx h */
import Immutable from 'immutable';
import SkillTable from '../SkillTable/SkillTable';

import {
  decorateData,
} from '../../utils';

if (process.env.IMPORT_SCSS) require(`./App.scss`); // eslint-disable-line global-require

class App extends Component {
  constructor(props) {
    super(props);

    const decoratedData = decorateData(props.data);

    // TODO (davidg): don't set currentNugget on load.
    // but it will need to set it in any func that relies on it
    this.state = {
      itemTree: Immutable.fromJS(decoratedData.itemTree),
      currentNugget: decoratedData.itemTree[0],
    };

    this.nuggetList = decoratedData.itemList;

    this.updateState = this.setState.bind(this);
  }

  render() {
    return (
      <div id="app">
        <header className="header">
          <h1 className="header__title">Know It All</h1>
          <a
            href="https://hackernoon.com/what-you-dont-know-about-web-development-d7d631f5d468#.ex2yp6d64"
            target="_blank"
            rel="noopener noreferrer"
            className="header__help"
            title={`Find out more about know it all, version ${this.props.version}`}
          >What is this?</a>
        </header>

        <SkillTable
          itemTree={this.state.itemTree}
          currentNugget={this.state.currentNugget}
          nuggetList={this.nuggetList}
          updateState={this.updateState}
        />
      </div>
    );
  }
}

export default App;
