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
  const radius = 12;
  const diameter = radius * 2;
  const sweepFlag = 1;

  const render = () => {
    const scoreSummary = store.getScoreSummary(item.id);
    let cumulativeRadians = 0;

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
        r: radius,
        style: {
          fill: scoreSummary.results[0].score.color,
        },
      });
    } else {
      // if there's more than one slice, render paths/arcs
      slices = scoreSummary.results.map((slice) => {
        const percent = slice.count / total;

        const startX = Math.cos(cumulativeRadians) * radius;
        const startY = Math.sin(cumulativeRadians) * radius;

        cumulativeRadians += 2 * Math.PI * percent;

        const endX = Math.cos(cumulativeRadians) * radius;
        const endY = Math.sin(cumulativeRadians) * radius;

        const largeFlag = percent > 0.5 ? 1 : 0;

        const arc = [radius, radius, 0, largeFlag, sweepFlag, endX, endY].join(` `);

        const d = [
          `M ${startX} ${startY}`,
          `A ${arc}`,
          `L 0 0`, // the center of the SVG
        ].join(` `);

        return path({
          d,
          style: {
            fill: slice.score.color,
          },
        });
      });
    }

    const result = div({ className: `pie-chart` },
      svg(
        {
          width: diameter,
          height: diameter,
          viewBox: `-${radius} -${radius} ${diameter} ${diameter}`,
        },
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
