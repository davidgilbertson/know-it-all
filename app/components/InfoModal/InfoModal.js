import {
  a,
  button,
  div,
  span,
  li,
  ul,
  h1,
  h2,
  svg,
  path,
} from '../../utils/elements';

import { EVENTS } from '../../utils/constants';
import swapNodes from '../../utils/swapNodes';

import store from '../../data/store';

if (process.env.IMPORT_SCSS) require(`./InfoModal.scss`); // eslint-disable-line global-require

function blockBodyScroll() {
  document.body.classList.toggle(`block-scroll`);
}

const InfoModal = () => {
  let el;

  const render = () => {
    // classList.toggle doesn't work in IE11
    if (store.isModalVisible) {
      document.body.classList.add(`block-scroll`);
    } else {
      document.body.classList.remove(`block-scroll`);
    }

    if (!store.isModalVisible) return div();

    const unknownItems = store.getUnknowns();

    const unknownItemsDom = unknownItems.map(item => {
      return li({ className: `info-modal__unknown-item`},
        span({ className: `info-modal__unknown-item-text`}, item.path),
        a(
          {
            className: `info-modal__unknown-item-link`,
            href: item.url,
            rel: `noopen norefferer`,
            target: `_blank`,
          },
          svg({ width: 20, height: 20, viewBox: `0 0 1024 1024` },
            path({ d: `M992.262 871.396l-242.552-206.294c-25.074-22.566-51.89-32.926-73.552-31.926 57.256-67.068 91.842-154.078 91.842-249.176 0-212.078-171.922-384-384-384-212.076 0-384 171.922-384 384s171.922 384 384 384c95.098 0 182.108-34.586 249.176-91.844-1 21.662 9.36 48.478 31.926 73.552l206.294 242.552c35.322 39.246 93.022 42.554 128.22 7.356s31.892-92.898-7.354-128.22zM384 640c-141.384 0-256-114.616-256-256s114.616-256 256-256 256 114.616 256 256-114.614 256-256 256z` }),
          ),
        ),
      );
    });

    return div(
      {
        className: `info-modal__background`,
        onclick : (e) => {
          // direct hits only
          if (e.eventPhase === Event.AT_TARGET) store.closeModal();
        },
      },
      div({ className: `info-modal` },
        div({ className: `info-modal__header` },
          h1({ className: `info-modal__title` },
            `Info`,
          ),
          button(
            {
              className: `info-modal__close`,
              onclick: () => {
                store.closeModal();
              },
            },
            `✖`
          ),
        ),
        div({ className: `info-modal__body` },
          a(
            {
              className: `info-modal__info-link`,
              href: `https://hackernoon.com/what-you-dont-know-about-web-development-d7d631f5d468#.ex2yp6d64`,
              rel: `noopener noreferrer`,
              target: `_blank`,
            },
            `A blog post about know it all`,
          ),
          a(
            {
              className: `info-modal__info-link`,
              href: `https://github.com/davidgilbertson/know-it-all`,
              rel: `noopener noreferrer`,
              target: `_blank`,
            },
            `Source on Github`,
          ),
          a(
            {
              className: `info-modal__info-link`,
              href: `https://github.com/davidgilbertson/know-it-all/issues`,
              rel: `noopener noreferrer`,
              target: `_blank`,
            },
            `Log an issue, make a suggestion`,
          ),
          h2({ className: `info-modal__unknown-items-title` },
            `Things you don't know`,
          ),
          ul({ className: `info-modal__unknown-items`},
            unknownItemsDom
          ),
        ),
      ),
    );
  };

  store.listen(EVENTS.MODAL_VISIBILITY_CHANGED, () => {
    el = swapNodes(el, render());
  });

  el = render();

  return el;
}

export default InfoModal;
