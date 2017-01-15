import { a } from '../../utils/elements';

if (process.env.IMPORT_SCSS) require(`./TwitterShareButton.scss`); // eslint-disable-line global-require

const TwitterShareButton = () => a(
  {
    className: `twitter-share-button`,
    href: `https://twitter.com/share`,
    dataset: {
      text: `Find out what you don't know about web development. @D__Gilbertson`,
      hashtags: `webdev #css #html #javascript #nodejs`,
    },
  },
  `Tweet`,
);

export default TwitterShareButton;
