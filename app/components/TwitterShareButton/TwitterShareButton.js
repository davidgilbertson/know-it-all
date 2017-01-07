import { a } from '../../utils/elements';

if (process.env.IMPORT_SCSS) require(`./TwitterShareButton.scss`); // eslint-disable-line global-require

const TwitterShareButton = () => a(
  {
    className: `twitter-share-button`,
    href: `https://twitter.com/share`,
    dataset: {
      text: `If you love web development, check out this site by @D__Gilbertson`,
      hashtags: `webdev #css #html #javascript #nodejs`,
    },
  },
  `Tweet`
);

export default TwitterShareButton;
