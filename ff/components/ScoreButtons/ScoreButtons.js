import store from '../../store';

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
    ? { borderColor: displayScore.color }
    : null;

  return button(
    {
      className: `score-buttons__score-button`,
      style: selectedStyle,
      onclick: (e) => {
        e.stopPropagation(); // don't want the item to be selected and trigger an update
        store.updateItem(item.id, { scoreKey: displayScore.key });
      },
    },
    displayScore.shortTitle,
  );
};

const ScoreButtons = props => div(
  { className: `score-buttons__button-wrapper` },
  ScoreButton(props, SCORES.LEVEL_1),
  ScoreButton(props, SCORES.LEVEL_2),
  ScoreButton(props, SCORES.LEVEL_3),
  ScoreButton(props, SCORES.LEVEL_4),
);

export default ScoreButtons;
