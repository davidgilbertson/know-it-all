// import { h } from 'preact'; /** @jsx h */
import Inferno from 'inferno'; /** @jsx Inferno */

if (process.env.IMPORT_SCSS) require(`./Tags.scss`); // eslint-disable-line global-require

const cache = {};

// memoizing the response is, like, a 2% speed improvement. Maybe.
const Tags = ({ tagList, tagUid }) => {
  const cacheKey = cache[tagUid];

  if (cacheKey) {
    return cacheKey;
  }

  if (!tagList.size) return null;

  const tagSpans = tagList.toArray().map(tag => (
    <span
      key={tag.get(`key`)}
      className="tags__tag"
      title={tag.get(`value`)}
    >
      {tag.get(`key`)}
    </span>
  ));

  const tagElements = (
    <div className="tags">
      {tagSpans}
    </div>
  );

  cache[tagUid] = tagElements;

  return tagElements;
};

export default Tags;
