import { h } from 'preact'; /** @jsx h */

import {
  SCORES,
} from '../../constants.js';

if (process.env.IMPORT_SCSS) require(`./ScoreButtons.scss`); // eslint-disable-line global-require

function renderScoreButton(props, displayScore) {
  if (
    (displayScore === SCORES.LEVEL_3 || displayScore === SCORES.LEVEL_2)
    && !props.item.get(`leaf`)
  ) return null;

  const currentScoreKey = props.item.get(`scoreKey`);
  const selected = currentScoreKey === displayScore.key;

  const selectedStyle = selected
  ? { borderColor: displayScore.color }
  : null;

  return (
    <label
      className="score-buttons__score-button"
      title={displayScore.value}
      style={selectedStyle}
    >
      <input
        className="score-buttons__score-button-input"
        type="radio"
        name={`${props.item.get(`id`)}-${props.item.get(`name`)}`}
        selected={selected}
        onChange={() => props.updateScore(props.item.get(`pathString`), displayScore.key)}
      />
      {displayScore.shortTitle}
    </label>
  );
}

const ScoreButtons = props => (
  <div className="score-buttons__button-wrapper">
    {renderScoreButton(props, SCORES.LEVEL_1)}
    {renderScoreButton(props, SCORES.LEVEL_2)}
    {renderScoreButton(props, SCORES.LEVEL_3)}
    {renderScoreButton(props, SCORES.LEVEL_4)}
  </div>
);

export default ScoreButtons;
