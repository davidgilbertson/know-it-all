import React from 'react';

import TableRow from './TableRow.jsx';
import { skills } from '../data/data.js';
import { decorateData } from '../utils';
import {
  KEYS,
} from '../constants';

class SkillTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      skills: decorateData(skills),
      activeRow: 0,
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.setActiveRow = this.setActiveRow.bind(this);
  }

  componentDidMount() {
    window.addEventListener(`keydown`, this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener(`keydown`, this.onKeyDown);
  }

  onChange(itemPath, score) {
    const newSkillsState = Object.assign({}, this.state.skills);
    const rootItem = newSkillsState[0];

    if (itemPath.length === 0) {
      rootItem.score = score;
    } else {
      const currentItem = itemPath.reduce((result, itemPos) => result.items[itemPos], rootItem);
      currentItem.score = score;
    }

    this.setState({
      skills: newSkillsState,
    });
  }

  onKeyDown(e) {
    if (e.keyCode === KEYS.UP) {
      if (this.state.activeRow <= 0) return;

      e.preventDefault();
      this.setActiveRow(this.state.activeRow - 1);
    }

    if (e.keyCode === KEYS.DOWN) {
      e.preventDefault();
      this.setActiveRow(this.state.activeRow + 1);
    }
  }

  setActiveRow(activeRow) {
    this.setState({ activeRow });
  }

  render() {
    const { state } = this;
    const styles = {
      content: {
        margin: `0 auto`,
        maxWidth: 800,
        boxShadow: `0 27px 55px 0 rgba(0, 0, 0, 0.3), 0 17px 17px 0 rgba(0, 0, 0, 0.15)`,
      },
    };

    return (
      <div style={styles.content}>
        <h2>Skill table</h2>

        <TableRow
          item={state.skills[0]}
          path={[]}
          activeRow={state.activeRow}
          setActiveRow={this.setActiveRow}
          onChange={this.onChange}
        />

        <pre>{JSON.stringify(skills, null, 2)}</pre>
      </div>
    );
  }
}

export default SkillTable;
