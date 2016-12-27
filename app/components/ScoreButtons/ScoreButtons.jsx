import { h } from 'preact'; /** @jsx h */

import {
  SCORES,
} from '../../constants';

if (process.env.IMPORT_SCSS) require(`./ScoreButtons.scss`); // eslint-disable-line global-require

function renderScoreButton(props, displayScore) {
  const currentScoreKey = props.item.scoreKey;
  const selected = currentScoreKey === displayScore.key;

  const selectedStyle = selected
  ? { borderColor: displayScore.color }
  : null;

  return (
    <button
      class="score-buttons__score-button"
      title={displayScore.value}
      style={selectedStyle}
      onClick={(e) => {
        e.stopPropagation();
        props.updateScore(props.item, displayScore.key);
      }}
    >
      {displayScore.shortTitle}
    </button>
  );
}

const ScoreButtons = props => (
  <div class="score-buttons__button-wrapper">
    {renderScoreButton(props, SCORES.LEVEL_1)}
    {renderScoreButton(props, SCORES.LEVEL_2)}
    {renderScoreButton(props, SCORES.LEVEL_3)}
    {renderScoreButton(props, SCORES.LEVEL_4)}
  </div>
);

export default ScoreButtons;
