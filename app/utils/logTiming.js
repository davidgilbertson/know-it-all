import now from './now';
import { ANALYTICS_STRINGS } from './constants';

export default function (timingVar) {
  if (`ga` in window) {
    const timingValue = now();
    console.info(timingVar, timingValue);

    ga(`send`, {
      hitType: `timing`,
      timingCategory: ANALYTICS_STRINGS.PERFORMANCE,
      timingVar,
      timingValue,
    });
  } else {
    console.warn(`You're trying to use Google Analytics before it's available.`);
  }
}
