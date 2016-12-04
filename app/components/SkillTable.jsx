import React from 'react';
const Immutable = require(`immutable`);

import TableRows from './TableRows';
import { decorateData } from '../utils';
import {
  COLORS,
  KEYS,
  SCORES,
} from '../constants';

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

class SkillTable extends React.Component {
  constructor(props) {
    super(props);

    const decoratedData = decorateData(props.data);
    this.state = {
      itemTree: Immutable.fromJS(decoratedData.itemTree),
      currentNugget: decoratedData.itemTree[0],
    };

    this.nuggetList = decoratedData.itemList;

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

    const saveScore = scoreNumber => {
      this.updateScore(currentItem.get(`pathString`), SCORES[`LEVEL_${scoreNumber}`]);
      this.goToNextKnowableRow(); // move to the next one after scoring
    };

    if (e.key === `0`) saveScore(0);
    if (e.key === `1`) saveScore(1);
    if (e.key === `2`) saveScore(2);
    if (e.key === `3`) saveScore(3);
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

  updateScore(nuggetPath, score) {
    this.setState(({ itemTree }) => ({
      itemTree: updateAtPath(itemTree, nuggetPath, `score`, score),
    }));
  }

  render() {
    const { state } = this;
    const styles = {
      content: {
        margin: `20px auto`,
        maxWidth: 1000,
        border: `1px solid ${COLORS.GREY_MID}`,
        background: COLORS.WHITE,
        boxShadow: `0 27px 55px 0 rgba(0, 0, 0, 0.3), 0 17px 17px 0 rgba(0, 0, 0, 0.15)`,
      },
    };

    return (
      <div style={styles.content}>
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

SkillTable.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default SkillTable;
