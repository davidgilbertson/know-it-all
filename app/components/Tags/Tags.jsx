import { h } from 'preact'; /** @jsx h */

if (process.env.IMPORT_SCSS) require(`./Tags.scss`); // eslint-disable-line global-require

const cache = {};

// memoizing the response is, like, a 2% speed improvement. On a good day.
const Tags = ({ tagList, tagUid }) => {
  const cacheKey = cache[tagUid];

  if (cacheKey) {
    return cacheKey;
  }

  // If no tags at all
  if (!tagList.length) return null;

  const tagSpans = tagList
  .filter(tag => tag.key !== `ROOT` && tag.key !== `GROUPING`)
  .map(tag => (
    <span
      key={tag.key}
      className="tags__tag"
      title={tag.value}
    >
      {tag.value}
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
