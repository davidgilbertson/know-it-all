import store from '../../data/store';
import {
  div,
  svg,
  path,
  circle,
} from '../../utils/elements';
import swapNodes from '../../utils/swapNodes';

if (process.env.IMPORT_SCSS) require(`./PieChart.scss`); // eslint-disable-line global-require

const PieChart = (item) => {
  let el;

  const render = () => {
    const scoreSummary = store.getScoreSummary(item.id);
    const total = scoreSummary.total;

    if (
      !scoreSummary ||
      !scoreSummary.results.length ||
      !store.scoresLoadedFromDisk ||
      total === 0
    ) return div({ className: `pie-chart` });

    let slices;

    // Note the svg viewBox is offset so the center of the SVG is 0,0
    if (scoreSummary.results && scoreSummary.results.length === 1) {
      // if there's only one slice, that's a circle
      slices = circle({
        r: 1,
        style: {
          fill: scoreSummary.results[0].score.color || ``, // set empty string to make iOS ignore fill
        },
      });
    } else {
      // if there's more than one slice, render paths/arcs
      let cumulativeRadians = 0;

      slices = scoreSummary.results.map((slice) => {
        const percent = slice.count / total;

        const startX = Math.cos(cumulativeRadians);
        const startY = Math.sin(cumulativeRadians);

        cumulativeRadians += 2 * Math.PI * percent;

        const endX = Math.cos(cumulativeRadians);
        const endY = Math.sin(cumulativeRadians);

        const largeArcFlag = percent > 0.5 ? 1 : 0;

        const d = [
          `M ${startX} ${startY}`,
          `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
          `L 0 0`,
        ].join(` `);

        return path({
          d,
          style: {
            fill: slice.score.color || ``, // set empty string to make iOS ignore fill
          },
        });
      });
    }

    const result = div({ className: `pie-chart` },
      svg({ viewBox: `-1 -1 2 2` },
        slices,
      ),
    );

    return result;
  };

  store.listen(`PIE-${item.id}`, () => {
    el = swapNodes(el, render());
  });

  el = render();

  return el;
};

export default PieChart;
