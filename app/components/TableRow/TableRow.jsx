import { h, Component } from 'preact'; /** @jsx h */
import classnames from 'classnames';
import TableRows from '../TableRows/TableRows';
import Icon from '../Icon/Icon';
import ScoreButtons from '../ScoreButtons/ScoreButtons';
import Tags from '../Tags/Tags';

import {
  TAGS,
} from '../../constants';

if (process.env.IMPORT_SCSS) require(`./TableRow.scss`); // eslint-disable-line global-require

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.onRowClick = this.onRowClick.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const thisProps = this.props;

    if (nextProps.item !== thisProps.item) {
      return true;
    }

    const selectedItemChanged = thisProps.currentItem.id !== nextProps.currentItem.id;

    if (selectedItemChanged) {
      const oldItemSelectedIsInTree = thisProps.currentItem.pathString.startsWith(thisProps.item.pathString);
      const newItemSelectedIsInTree = nextProps.currentItem.pathString.startsWith(nextProps.item.pathString);

      if (oldItemSelectedIsInTree || newItemSelectedIsInTree) {
        return true;
      }
    }

    return false;
  }

  onRowClick() {
    this.props.selectItem(this.props.item);
  }

  toggleExpanded(e) {
    const { collapse, expand, item } = this.props;
    e.stopPropagation(); // we don't want to row to be selected

    if (item.expanded) {
      collapse(item);
    } else {
      expand(item);
    }
  }

  render() {
    const { props } = this;

    const children = props.itemList.filter(item => item.parentId === props.item.id);

    const hasChildren = !!children.length;
    const isActiveRow = props.item.row === props.currentItem.row;

    const childRows = hasChildren && props.item.expanded
      ? (
        <TableRows
          items={children}
          currentItem={props.currentItem}
          itemList={props.itemList}
          selectItem={props.selectItem}
          updateScore={props.updateScore}
          expand={props.expand}
          collapse={props.collapse}
        />
      )
      : null;

    const isNotCode = !!(props.item.tags || []).find(tagKey => (
      tagKey === TAGS.ROOT.key ||
      tagKey === TAGS.GROUPING.key ||
      tagKey === TAGS.INFO.key
    ));

    const className = classnames(
      `table-row`,
      { 'table-row--selected': isActiveRow },
      { 'table-row--has-no-children': !hasChildren },
      { 'table-row--expanded': props.item.expanded },
    );

    const tableRowNameStyle = !isNotCode ? {
      fontFamily: `"Courier New", monospace`,
    } : null;

    const notes = props.item.notes;
    const notesText = notes
    ? (
      <span className="table-row__notes">
        ({props.item.notes})
      </span>
    ) : null;


    /* eslint-disable jsx-a11y/no-static-element-interactions */
    // because it's OK to have a <div> with role button clickable
    return (
      <div className={className}>
        <div
          role="button"
          tabIndex="0"
          className="table-row__content"
          onClick={this.onRowClick}
        >
          <div
            onClick={this.toggleExpanded}
            className="table-row__triangle-wrapper"
          >
            <Icon
              className="table-row__triangle-icon"
              icon={Icon.ICONS.downChevron}
              size="20"
            />
          </div>

          <div className="table-row__words">
            <p
              className="table-row__name"
            >
              <span
                style={tableRowNameStyle}
              >
                {props.item.name}
              </span>

              {notesText}
            </p>


            <Tags
              tagList={props.item.tags}
            />
          </div>

          <ScoreButtons
            item={props.item}
            updateScore={props.updateScore}
          />
        </div>

        {childRows}
      </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}

export default TableRow;
