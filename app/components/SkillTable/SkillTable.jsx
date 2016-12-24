import { h, Component } from 'preact'; /** @jsx h */
import TableRows from '../TableRows/TableRows';

import {
  KEYS,
} from '../../constants';

import {
  getItemByRow,
  updateAtPath,
} from '../../utils';

if (process.env.IMPORT_SCSS) require(`./SkillTable.scss`); // eslint-disable-line global-require

class SkillTable extends Component {
  constructor(props) {
    super(props);

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
    const { props } = this;

    const currentItem = getItemByRow({
      itemTree: props.itemTree,
      nuggetList: this.props.nuggetList,
    }, props.currentNugget.row);

    if (e.keyCode === KEYS.UP) {
      if (props.currentNugget.row <= 1) return; // rows are 1-indexed

      e.preventDefault();
      this.goToRow(props.currentNugget.row - 1);
    }

    if (e.keyCode === KEYS.DOWN) {
      if (props.currentNugget.row >= this.props.nuggetList.length - 1) return;

      e.preventDefault();
      this.goToRow(props.currentNugget.row + 1);
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

    const saveScore = (scoreKey) => {
      this.updateScore(currentItem.get(`pathString`), scoreKey);
      this.goToNextKnowableRow(); // move to the next one after scoring
    };

    if (e.key === `0`) saveScore(`LEVEL_0`);
    if (e.key === `1`) saveScore(`LEVEL_1`);
    if (e.key === `2`) saveScore(`LEVEL_2`);
    if (e.key === `3`) saveScore(`LEVEL_3`);
    if (e.key === `4`) saveScore(`LEVEL_4`);
  }

  goToNextKnowableRow() {
    const currentActiveRow = this.props.currentNugget.row;
    const nextNugget = this.props.nuggetList.find(nugget => (
      nugget.row > currentActiveRow
    ));

    if (nextNugget) {
      setTimeout(() => {
        this.goToRow(nextNugget.row);
      }, 150); // give the user time to see the score update
    }
  }

  goToRow(row) {
    const currentNugget = this.props.nuggetList.find(nugget => nugget.row === row);

    const pathSteps = currentNugget.pathString.split(`.`);

    while (pathSteps.length > 1) {
      pathSteps.pop();
      const thisPath = pathSteps.join(`.`);

      // TODO (davidg): room for performance improvement here.
      // This is called when not needed.
      this.props.updateState(({ itemTree }) => ({
        itemTree: updateAtPath(itemTree, thisPath, `isExpanded`, true),
      }));
    }

    this.props.updateState({ currentNugget });
  }

  expandCollapse(nuggetPath, isExpanded) {
    this.props.updateState(({ itemTree }) => ({
      itemTree: updateAtPath(itemTree, nuggetPath, `isExpanded`, isExpanded),
    }));
  }

  updateScore(nuggetPath, scoreKey) {
    this.props.updateState(({ itemTree }) => ({
      itemTree: updateAtPath(itemTree, nuggetPath, `scoreKey`, scoreKey),
    }));
  }

  render() {
    return (
      <div className="skill-table">
        <TableRows
          items={this.props.itemTree}
          currentNugget={this.props.currentNugget}
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
