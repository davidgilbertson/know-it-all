import React from 'react';

import TableRow from './TableRow.jsx';
import { skills } from '../data/data.js';

class SkillTable extends React.Component {
  constructor(props) {
    super(props);
    this.renderItems = this.renderItems.bind(this);

    this.state = { skills };
  }

  renderItems() {
    return this.state.skills.map(item => <TableRow key={item.name} item={item} depth={0} />);
  }

  render() {
    return (
      <div>
        <h2>Skill table</h2>
        <div>{this.renderItems()}</div>
        <pre>{JSON.stringify(skills, null, 2)}</pre>
      </div>
    );
  }
}

export default SkillTable;
