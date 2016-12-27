import { h, Component } from 'preact'; /** @jsx h */
import SkillTable from '../SkillTable/SkillTable';

if (process.env.IMPORT_SCSS) require(`./App.scss`); // eslint-disable-line global-require

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemList: props.data,
      currentItem: props.data[0],
    };

    this.updateState = this.updateState.bind(this);
  }

  // componentDidMount() {
    // setTimeout(() => {
    //   const fetchPromises = window.APP_DATA.otherModuleFileNames.map((fileName) => {
    //     return fetch(fileName).then(response => response.json());
    //   });
    //
    //   Promise.all(fetchPromises).then((data) => {
    //     this.setState(({ itemList }) => ({
    //       itemList: itemList.concat(...data),
    //     }));
    //   });
    // }, 10000);
  // }

  updateState(update) {
    this.setState(update);
  }

  render() {
    return (
      <div id="app">
        <header class="header">
          <h1 class="header__title">Know It All</h1>
          <a
            href="https://hackernoon.com/what-you-dont-know-about-web-development-d7d631f5d468#.ex2yp6d64"
            target="_blank"
            rel="noopener noreferrer"
            class="header__help"
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
