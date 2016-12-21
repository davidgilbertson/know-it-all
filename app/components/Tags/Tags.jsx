import { h } from 'preact'; /** @jsx h */

if (process.env.IMPORT_SCSS) require(`./Tags.scss`); // eslint-disable-line global-require

const cache = {};

// memoizing the response is, like, a 2% speed improvement. Maybe.
const Tags = ({ tagList, tagUid }) => {
  const cacheKey = cache[tagUid];

  if (cacheKey) {
    return cacheKey;
  }

  // If no tags at all
  if (!tagList.size) return null;

  const tagSpans = tagList
  .toArray()
  .filter(tag => tag.get(`key`) !== `ROOT` && tag.get(`key`) !== `GROUPING`)
  .map(tag => (
    <span
      key={tag.get(`key`)}
      className="tags__tag"
      title={tag.get(`value`)}
    >
      {tag.get(`key`)}
    </span>
  ));

  // If no tags after filtering out some tags
  if (!tagSpans || !tagSpans.length) return null;

  const tagElements = (
    <p>
      {tagSpans}
    </p>
  );

  cache[tagUid] = tagElements;

  return tagElements;
};

export default Tags;
