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

const App = () => (
  <div>
    <header style={styles.header}>
      <h1 style={styles.title}>Know It All</h1>
    </header>
    <SkillTable />
  </div>
);

export default App;
