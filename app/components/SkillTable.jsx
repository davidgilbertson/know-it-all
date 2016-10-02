import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

import TableRow from './TableRow.jsx';
import { nuggetTreeData } from '../data/nuggetTreeData.js';
import { decorateData } from '../utils';
import {
  COLORS,
  KEYS,
  SCORES,
} from '../constants';

function getItemByPath(tree, path) {
  return path.reduce(
    (result, itemPos) => result.items[itemPos],
    tree
  );
}

function getItemByRow(data, row) {
  const activeNugget = data.nuggetList.find(nugget => nugget.row === row);
  return getItemByPath(data.nuggetTree, activeNugget.path);
}

class SkillTable extends React.Component {
  constructor(props) {
    super(props);

    const decoratedData = decorateData(nuggetTreeData);
    this.state = {
      nuggetTree: decoratedData.nuggetTree,
      currentNugget: decoratedData.nuggetTree.items[0], // "TOP"
    };

    this.nuggetList = decoratedData.nuggetList;

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
    const stateClone = cloneDeep(state);
    const currentItem = getItemByRow({
      nuggetTree: stateClone.nuggetTree,
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
      if (currentItem.isExpanded) {
        this.expandCollapse(currentItem.path, false);
      }
      return;
    }

    if (e.keyCode === KEYS.RIGHT) {
      if (!currentItem.isExpanded) {
        this.expandCollapse(currentItem.path, true);
      }
      return;
    }

    const saveScore = scoreNumber => {
      this.updateScore(currentItem.path, SCORES[`LEVEL_${scoreNumber}`]);
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
      nugget.row > currentActiveRow && nugget.knowable
    ));

    if (nextNugget) {
      setTimeout(() => {
        this.goToRow(nextNugget.row);
      }, 150); // give the user time to see the score update
    }
  }

  goToRow(row) {
    const currentNugget = this.nuggetList.find(nugget => nugget.row === row);
    const newNuggetTree = cloneDeep(this.state.nuggetTree);
    let currentLevel = newNuggetTree;
    let updateTree = false;

    currentNugget.path.forEach(pos => {
      if (!currentLevel.isExpanded) {
        currentLevel.isExpanded = true;
        updateTree = true;
      }
      currentLevel = currentLevel.items[pos];
    });

    if (updateTree) {
      this.setState({ nuggetTree: newNuggetTree });
    }
    this.setState({ currentNugget });
  }

  expandCollapse(nuggetPath, isExpanded) {
    const nuggetTree = cloneDeep(this.state.nuggetTree);
    const currentItem = getItemByPath(nuggetTree, nuggetPath);

    if (!currentItem || !currentItem.items || !currentItem.items.length) return;

    currentItem.isExpanded = isExpanded;

    this.setState({ nuggetTree });
  }

  updateScore(nuggetPath, score) {
    const nuggetTree = cloneDeep(this.state.nuggetTree);

    const currentItem = getItemByPath(nuggetTree, nuggetPath);
    currentItem.score = score;

    this.setState({ nuggetTree });
  }

  render() {
    const { state } = this;
    const styles = {
      content: {
        margin: `20px auto`,
        border: `1px solid ${COLORS.GREY_MID}`,
        maxWidth: 800,
        boxShadow: `0 27px 55px 0 rgba(0, 0, 0, 0.3), 0 17px 17px 0 rgba(0, 0, 0, 0.15)`,
      },
    };

    return (
      <div style={styles.content}>
        <TableRow
          item={state.nuggetTree.items[0]}
          currentNugget={state.currentNugget}
          goToRow={this.goToRow}
          updateScore={this.updateScore}
          expandCollapse={this.expandCollapse}
          goToNextKnowableRow={this.goToNextKnowableRow}
        />

        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    );
  }
}

export default SkillTable;
