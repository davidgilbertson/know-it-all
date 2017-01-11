import store from '../../data/store';

import {
  button,
  div,
} from '../../utils/elements';

import {
  SCORES,
} from '../../utils/constants';

if (process.env.IMPORT_SCSS) require(`./ScoreButtons.scss`); // eslint-disable-line global-require

const ScoreButton = (item, displayScore, isScoreBar) => {
  const currentScoreKey = item.scoreKey;
  const selected = currentScoreKey === displayScore.key;

  const selectedStyle = selected
    ? {
      background: displayScore.color,
      borderColor: displayScore.color,
    }
    : null;

  let className = `score-buttons__score-button`;
  if (selected) className += ` score-buttons__score-button--selected`;

  const buttonText = isScoreBar ? displayScore.splitTitle : displayScore.shortTitle;

  return button(
    {
      className,
      style: selectedStyle,
      onclick: (e) => {
        e.stopPropagation(); // don't want the item to be selected and trigger an update
        const newScore = selected ? SCORES.LEVEL_0.key : displayScore.key;

        store.updateItem(item.id, { scoreKey: newScore });
      },
    },
    buttonText,
  );
};

const ScoreButtons = ({ item, isScoreBar }) => {
  if (!item) return null;

  let className = `score-buttons`;
  if (isScoreBar) className += ` score-buttons--score-bar`;
  if (!isScoreBar) className += ` score-buttons--in-row`;

  return div(
      { className },
      ScoreButton(item, SCORES.LEVEL_1, isScoreBar),
      ScoreButton(item, SCORES.LEVEL_2, isScoreBar),
      ScoreButton(item, SCORES.LEVEL_3, isScoreBar),
      ScoreButton(item, SCORES.LEVEL_4, isScoreBar),
    );
};

export default ScoreButtons;
