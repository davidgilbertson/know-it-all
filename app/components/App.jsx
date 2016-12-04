import React from 'react';

import SkillTable from './SkillTable.jsx';

const styles = {
  header: {
    background: `black`,
    textAlign: `center`,
  },
  title: {
    padding: 20,
    color: `white`,
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      stats: [],
    };
  }

  componentWillMount() {
    const newStats = this.state.stats.slice();
    newStats.push(`Ready`);
    this.setState({ stats: newStats });
  }

  render() {
    return (
      <div>
        <header style={styles.header}>
          <h1 style={styles.title}>Know It All</h1>
        </header>

        <div>
          <pre>{JSON.stringify(this.state.stats, null, 2)}</pre>
        </div>
        <SkillTable {...this.state} />
      </div>
    );
  }
}

App.propTypes = {
  data: React.PropTypes.array,
};

export default App;
