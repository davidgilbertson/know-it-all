import { h, Component } from 'preact'; /** @jsx h */
import TableRows from '../TableRows/TableRows';

import {
  KEYS,
} from '../../constants';

const merge = (...items) => Object.assign({}, ...items); // God bless you, ES6

if (process.env.IMPORT_SCSS) require(`./SkillTable.scss`); // eslint-disable-line global-require

function getNextVisibleItem(currentRow, rowList) {
  return rowList
  .slice(currentRow.row + 1)
  .find(item => item.visible);
}

function getPrevVisibleItem(currentRow, rowList) {
  return rowList
  .slice(0, currentRow.row)
  .reverse()
  .find(item => item.visible);
}

class SkillTable extends Component {
  constructor(props) {
    super(props);

    this.updateScore = this.updateScore.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
  }

  componentDidMount() {
    window.addEventListener(`keydown`, this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener(`keydown`, this.onKeyDown);
  }

  onKeyDown(e) {
    const { props } = this;

    if (e.keyCode === KEYS.UP) {
      if (props.currentItem.row < 1) return;

      e.preventDefault();
      this.selectItem(getPrevVisibleItem(props.currentItem, props.itemList));
    }

    if (e.keyCode === KEYS.DOWN) {
      if (props.currentItem.row >= props.itemList.length - 1) return;

      e.preventDefault();

      this.selectItem(getNextVisibleItem(props.currentItem, props.itemList));
    }

    if (e.keyCode === KEYS.LEFT) {
      if (props.currentItem.expanded) {
        this.collapse(props.currentItem);
      }
      return;
    }

    if (e.keyCode === KEYS.RIGHT) {
      if (!props.currentItem.expanded) {
        this.expand(props.currentItem);
      }
      return;
    }

    const saveScore = (scoreKey) => {
      this.updateScore(props.currentItem, scoreKey);
    };

    if (e.key === `0`) saveScore(`LEVEL_0`);
    if (e.key === `1`) saveScore(`LEVEL_1`);
    if (e.key === `2`) saveScore(`LEVEL_2`);
    if (e.key === `3`) saveScore(`LEVEL_3`);
    if (e.key === `4`) saveScore(`LEVEL_4`);
  }

  // TODO (davidg): there is much duplication in expand(), collapse(), selectItem() and updateScore()
  // do something smart.
  expand(itemToExpand) {
    const nextItemList = this.props.itemList.map((item) => {
      // item is child, mark as visible
      if (item.parentId === itemToExpand.id) {
        return merge(item, { visible: true });
      }

      // item is ancestor, mark as changed
      // so that shouldComponentUpdate is true for all ancestors
      if (itemToExpand.pathString.startsWith(item.pathString)) {
        return merge(item, { expanded: true });
      }

      return item;
    });

    this.props.updateState({
      itemList: nextItemList,
      currentItem: merge(this.props.currentItem, { expanded: true }),
    });
  }

  collapse(itemToCollapse) {
    const nextItemList = this.props.itemList.map((item) => {
      if (item.id === itemToCollapse.id) {
        return merge(item, { expanded: false });
      }

      // item is descendant, mark as not visible
      if (item.pathString.startsWith(itemToCollapse.pathString)) {
        return merge(item, { visible: false });
      }

      // item is ancestor, mark as changed
      // so that shouldComponentUpdate is true for all ancestors
      if (itemToCollapse.pathString.startsWith(item.pathString)) {
        return merge(item);
      }

      return item;
    });

    this.props.updateState({
      itemList: nextItemList,
      currentItem: merge(this.props.currentItem, { expanded: false }),
    });
  }

  selectItem(itemToSelect, ensureItemIsVisible) {
    if (!itemToSelect) return;

    // it auto-advancing to the next row, ensure that it's visible
    // by expanding all ancestors
    if (ensureItemIsVisible) {
      const nextItemList = this.props.itemList.map((item) => {
        // item is a match or an ancestor
        // so that shouldComponentUpdate is true for all ancestors
        if (itemToSelect.pathString.startsWith(item.pathString)) {
          return merge(item, {
            expanded: true,
            visible: true,
          });
        }

        return item;
      });

      this.props.updateState({ itemList: nextItemList });
    }

    this.props.updateState({ currentItem: itemToSelect });
  }

  updateScore(itemToScore, scoreKey) {
    const itemToSelect = this.props.itemList[itemToScore.row + 1];

    const nextItemList = this.props.itemList.map((item) => {
      if (item.id === itemToScore.id) {
        return merge(item, {
          scoreKey,
          expanded: true, // you can score a non-expanded item
        });
      }

      // expand the new selected item and all ancestors
      if (itemToSelect && itemToSelect.pathString.startsWith(item.pathString)) {
        return merge(item, {
          expanded: true,
          visible: true,
        });
      }

      // mark siblings of the new selected item visible
      if (itemToSelect && item.parentId === itemToSelect.parentId) {
        return merge(item, { visible: true });
      }

      return item;
    });

    this.props.updateState({ itemList: nextItemList });

    if (itemToSelect) { // false for the very very last item
      this.props.updateState({
        currentItem: merge(itemToSelect, { expanded: true }),
      });
    }
  }

  render() {
    const childRows = this.props.itemList.filter(item => !item.parentId);
    console.log(`  --  >  SkillTable.jsx:200 > render > childRows.length:`, childRows.length);

    return (
      <div class="skill-table">
        <TableRows
          items={childRows}
          currentItem={this.props.currentItem}
          itemList={this.props.itemList}
          selectItem={this.selectItem}
          updateScore={this.updateScore}
          expand={this.expand}
          collapse={this.collapse}
        />
      </div>
    );
  }
}

export default SkillTable;
