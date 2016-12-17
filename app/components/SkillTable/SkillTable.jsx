// import { h, Component } from 'preact'; /** @jsx h */
import Inferno from 'inferno'; /** @jsx Inferno */
import Component from 'inferno-component';

const Immutable = require(`immutable`);

import TableRows from '../TableRows/TableRows';
import { decorateData } from '../../utils';
import {
  KEYS,
} from '../../constants';

if (process.env.IMPORT_SCSS) require(`./SkillTable.scss`); // eslint-disable-line global-require

function getArrayPath(stringPath) {
  return stringPath.replace(/\./g, `.children.`).split(`.`);
}

// TODO (davidg): this isn't needed, can just be in getItemByRow, no?
function getItemByPath(tree, pathString) {
  const pathAsArray = getArrayPath(pathString);

  return tree.getIn(pathAsArray);
}

function getItemByRow(data, row) {
  const activeNugget = data.nuggetList.find(nugget => nugget.row === row);
  return getItemByPath(data.itemTree, activeNugget.pathString);
}

function updateAtPath(object, path, prop, value) {
  const pathAsArray = getArrayPath(path);
  return object.updateIn(pathAsArray, item => item.set(prop, value));
}

class SkillTable extends Component {
  constructor(props) {
    super(props);

    // TODO (davidg): we will always have data, since we wait for it before rendering on the client.
    if (props.data) { // when rendered in Node, we will have data already
      const decoratedData = decorateData(props.data);

      // TODO (davidg): don't set currentNugget on load.
      // but it will need to set it in any func that relies on it
      this.state = {
        itemTree: Immutable.fromJS(decoratedData.itemTree),
        currentNugget: decoratedData.itemTree[0],
      };

      this.nuggetList = decoratedData.itemList;
    } else { // when rendered on client we won't have data yet.
      // this.state = {
      //   itemTree: Immutable.fromJS([]),
      //   currentNugget: {},
      // };
      //
      // this.nuggetList = [];
    }

    this.updateScore = this.updateScore.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.expandCollapse = this.expandCollapse.bind(this);
    this.goToNextKnowableRow = this.goToNextKnowableRow.bind(this);
    this.goToRow = this.goToRow.bind(this);
  }

  componentDidMount() {
    window.addEventListener(`keydown`, this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener(`keydown`, this.onKeyDown);
  }

  onKeyDown(e) {
    const { state } = this;

    const currentItem = getItemByRow({
      itemTree: state.itemTree,
      nuggetList: this.nuggetList,
    }, state.currentNugget.row);

    if (e.keyCode === KEYS.UP) {
      if (state.currentNugget.row <= 0) return;

      e.preventDefault();
      this.goToRow(state.currentNugget.row - 1);
    }

    if (e.keyCode === KEYS.DOWN) {
      if (state.currentNugget.row >= this.nuggetList.length - 1) return;

      e.preventDefault();
      this.goToRow(state.currentNugget.row + 1);
    }

    if (e.keyCode === KEYS.LEFT) {
      if (currentItem.get(`isExpanded`)) {
        this.expandCollapse(currentItem.get(`pathString`), false);
      }
      return;
    }

    if (e.keyCode === KEYS.RIGHT) {
      if (!currentItem.get(`isExpanded`)) {
        this.expandCollapse(currentItem.get(`pathString`), true);
      }
      return;
    }

    const saveScore = scoreKey => {
      this.updateScore(currentItem.get(`pathString`), scoreKey);
      this.goToNextKnowableRow(); // move to the next one after scoring
    };

    if (e.key === `0`) saveScore(`LEVEL_0`);
    if (e.key === `1`) saveScore(`LEVEL_1`);
    if (e.key === `2`) saveScore(`LEVEL_2`);
    if (e.key === `3`) saveScore(`LEVEL_3`);
  }

  goToNextKnowableRow() {
    const currentActiveRow = this.state.currentNugget.row;
    const nextNugget = this.nuggetList.find(nugget => (
      nugget.row > currentActiveRow && nugget.leaf
    ));

    if (nextNugget) {
      setTimeout(() => {
        this.goToRow(nextNugget.row);
      }, 150); // give the user time to see the score update
    }
  }

  goToRow(row) {
    const currentNugget = this.nuggetList.find(nugget => nugget.row === row);

    const pathSteps = currentNugget.pathString.split(`.`);

    while (pathSteps.length > 1) {
      pathSteps.pop();
      const thisPath = pathSteps.join(`.`);

      // TODO (davidg): room for performance improvement here.
      // This is called when not needed.
      this.setState(({ itemTree }) => ({
        itemTree: updateAtPath(itemTree, thisPath, `isExpanded`, true),
      }));
    }

    this.setState({ currentNugget });
  }

  expandCollapse(nuggetPath, isExpanded) {
    this.setState(({ itemTree }) => ({
      itemTree: updateAtPath(itemTree, nuggetPath, `isExpanded`, isExpanded),
    }));
  }

  updateScore(nuggetPath, scoreKey) {
    this.setState(({ itemTree }) => ({
      itemTree: updateAtPath(itemTree, nuggetPath, `scoreKey`, scoreKey),
    }));
  }

  render() {
    const { state } = this;

    return (
      <div className="skill-table">
        <TableRows
          items={state.itemTree}
          currentNugget={state.currentNugget}
          goToRow={this.goToRow}
          updateScore={this.updateScore}
          expandCollapse={this.expandCollapse}
          goToNextKnowableRow={this.goToNextKnowableRow}
        />
      </div>
    );
  }
}

export default SkillTable;
