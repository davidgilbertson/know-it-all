import { h } from 'preact'; /** @jsx h */

if (process.env.IMPORT_SCSS) require(`./Icon.scss`); // eslint-disable-line global-require

const Icon = props => (
  <svg
    width={props.size}
    height={props.size}
    className={`icon ${props.className || ``}`}
    viewBox="0 0 128 128"
  >
    <path
      className="icon__path"
      d={props.icon}
    />
  </svg>
);

Icon.ICONS = {
  downChevron: `m 0,32 16,0 48,48 48,-48 16,0 -64,64 z`,
};

export default Icon;
