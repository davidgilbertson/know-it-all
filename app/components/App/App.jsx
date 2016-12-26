import { h, Component } from 'preact'; /** @jsx h */
import SkillTable from '../SkillTable/SkillTable';

// import {
//   decorateData,
// } from '../../utils';

if (process.env.IMPORT_SCSS) require(`./App.scss`); // eslint-disable-line global-require

class App extends Component {
  constructor(props) {
    super(props);

    // console.time(`decorateData()`);
    // const decoratedData = decorateData(props.data);
    // console.timeEnd(`decorateData()`);

    this.state = {
      itemList: props.data,
      currentItem: props.data[0],
    };

    this.updateState = this.setState.bind(this);
    this.hasUsedKeyboard = this.hasUsedKeyboard.bind(this);
  }

  hasUsedKeyboard() {
    // TODO (davidg): show tip about shortcuts
    // for arrow keys? For number keys?
    // also, if user is navigating with keyboard, scroll the screen for them
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
          itemList={this.state.itemList}
          currentItem={this.state.currentItem}
          updateState={this.updateState}
        />
      </div>
    );
  }
}

export default App;
