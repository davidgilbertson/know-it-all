import store from '../../data/store';

import {
  button,
  div,
} from '../../utils/elements';

import {
  SCORES,
} from '../../utils/constants';

if (process.env.IMPORT_SCSS) require(`./ScoreButtons.scss`); // eslint-disable-line global-require

const ScoreButton = (item, displayScore) => {
  const currentScoreKey = item.scoreKey;
  const selected = currentScoreKey === displayScore.key;

  const selectedStyle = selected
    ? {
      borderColor: displayScore.color,
      outlineColor: displayScore.color,
    }
    : null;

  let className = `score-buttons__score-button`;
  if (selected) className += ` score-buttons__score-button--selected`;

  return button(
    {
      className,
      style: selectedStyle,
      onclick: (e) => {
        e.stopPropagation(); // don't want the item to be selected and trigger an update
        if (selected) return;

        store.updateItem(item.id, { scoreKey: displayScore.key });
      },
    },
    displayScore.shortTitle,
  );
};

const ScoreButtons = ({ item, isScoreBar }) => {
  if (!item) return null;

  let className = `score-buttons`;
  if (isScoreBar) className += ` score-buttons--score-bar`;
  if (!isScoreBar) className += ` score-buttons--in-row`;

  return div(
      { className },
      ScoreButton(item, SCORES.LEVEL_1),
      ScoreButton(item, SCORES.LEVEL_2),
      ScoreButton(item, SCORES.LEVEL_3),
      ScoreButton(item, SCORES.LEVEL_4),
    );
};

export default ScoreButtons;
