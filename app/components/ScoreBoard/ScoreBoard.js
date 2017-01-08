import store from '../../data/store';
import { div } from '../../utils/elements';

if (process.env.IMPORT_SCSS) require(`./ScoreBoard.scss`); // eslint-disable-line global-require

const ScoreBoard = () => {
  const scores = store.getScoreCounts().map(scoreCount => (
    div({ className: `score-board__score` },
      div({ className: `score-board__score-title` },
        scoreCount.score.shortTitle,
      ),
      div(
        {
          className: `score-board__score-count`,
          style: {
            color: scoreCount.score.color,
          },
        },
        scoreCount.count.toLocaleString(),
      ),
    )
  ));

  return div({ className: `score-board` },
    scores,
  );
};

export default ScoreBoard;
