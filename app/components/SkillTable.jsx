import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

import TableRow from './TableRow.jsx';
import { skills } from '../data/data.js';
import { decorateData } from '../utils';
import {
  COLORS,
  KEYS,
  SCORES,
} from '../constants';

function getItemByPath(tree, path) {
  return path.reduce(
    (result, itemPos) => result.items[itemPos],
    { items: [tree] } // TODO so dodgy, just structure the data butter
  );
}

function getItemByRow(data, row) {
  const activeNugget = data.nuggetList.find(nugget => nugget.row === row);
  return getItemByPath(data.nuggetTree[0], activeNugget.path);
}

class SkillTable extends React.Component {
  constructor(props) {
    super(props);

    const decoratedData = decorateData(skills);
    this.state = {
      nuggetTree: decoratedData.nuggetTree,
      nuggetList: decoratedData.nuggetList,
      activeRow: 0,
    };

    this.updateScore = this.updateScore.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.setActiveRow = this.setActiveRow.bind(this);
    this.expandCollapse = this.expandCollapse.bind(this);
    this.goToNextKnowableRow = this.goToNextKnowableRow.bind(this);
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
    const currentItem = getItemByRow(stateClone, state.activeRow);

    if (e.keyCode === KEYS.UP) {
      if (state.activeRow <= 0) return;

      e.preventDefault();
      this.setActiveRow(state.activeRow - 1);
    }

    if (e.keyCode === KEYS.DOWN) {
      if (state.activeRow >= state.nuggetList.length - 1) return;

      e.preventDefault();
      this.setActiveRow(state.activeRow + 1);
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

  setActiveRow(activeRow) {
    this.setState({ activeRow });
  }

  goToNextKnowableRow() {
    const currentActiveRow = this.state.activeRow;
    const nextNugget = this.state.nuggetList.find(nugget => (
      nugget.row > currentActiveRow && nugget.knowable
    ));

    if (nextNugget) {
      setTimeout(() => {
        this.setState({ activeRow: nextNugget.row });
      }, 150);
    }
  }

  expandCollapse(nuggetPath, isExpanded) {
    const nuggetTree = cloneDeep(this.state.nuggetTree);

    const currentItem = getItemByPath(nuggetTree[0], nuggetPath);
    if (!currentItem || !currentItem.items || !currentItem.items.length) return;

    currentItem.isExpanded = isExpanded;

    this.setState({ nuggetTree });
  }

  updateScore(nuggetPath, score) {
    const nuggetTree = cloneDeep(this.state.nuggetTree);

    const currentItem = getItemByPath(nuggetTree[0], nuggetPath);
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
          item={state.nuggetTree[0]}
          path={[]}
          activeRow={state.activeRow}
          setActiveRow={this.setActiveRow}
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
