import { h } from 'preact'; /** @jsx h */
import { TAGS } from '../../constants';

if (process.env.IMPORT_SCSS) require(`./Tags.scss`); // eslint-disable-line global-require

const cache = {};

// memoizing the response is, like, a 2% speed improvement. On a good day.
const Tags = ({ tagList }) => {
  const tagUid = tagList.toString();
  const cacheKey = cache[tagUid];

  if (cacheKey) {
    return cacheKey;
  }

  // If no tags at all
  if (!tagList.length) return null;

  const tagSpans = tagList
  .filter(tagKey => tagKey !== `ROOT` && tagKey !== `GROUPING`)
  .map((tagKey) => {
    const tagName = TAGS[tagKey] ? TAGS[tagKey].value : ``;

    return (
      <span
        key={tagKey}
        class="tags__tag"
        title={tagName}
      >
        {tagName}
      </span>
    );
  });

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
