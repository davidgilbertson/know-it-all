import {
  p,
  span,
} from '../../utils/elements';

import {
  TAGS,
} from '../../utils/constants';

if (process.env.IMPORT_SCSS) require(`./Tags.scss`); // eslint-disable-line global-require

const Tags = (tags) => {
  const tagSpans = tags
  .filter(tagKey => tagKey !== `ROOT` && tagKey !== `GROUPING`)
  .map((tagKey) => {
    const tagName = TAGS[tagKey] ? TAGS[tagKey].value : ``;

    return span({ className: `tags__tag` },
      tagName,
    );
  });

  return p(tagSpans);
};

export default Tags;
