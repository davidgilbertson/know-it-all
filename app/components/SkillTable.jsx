import React from 'react';
const skills = [];

class SkillTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skills: [],
    };
  }

  render() {
    return (
      <div>
        <h2>Skill table</h2>
        <pre>{JSON.stringify(skills, null, 2)}</pre>
      </div>
    );
  }
}

export default SkillTable;
