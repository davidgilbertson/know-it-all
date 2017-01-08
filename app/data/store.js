/**
 * The store could be just a global object. I read and write as I please.
 * It could also have some useful methods. Get children, updateItem, etc.
 * Also it could emit a change event. But how to handle that change?
 * Is it fast to listen to that on hundreds of row components?
 *
 * What do I ever need to do?
 * 1. advance to the next visible row
 *  - getNextVisible()
 *  - change the currently selected
 *  - in DOM: unhighlight the currently highlighted item
 *  and highlight the now-highlighted item.
 *   - sometimes I'll want to expand an item and mark all children
 *   as being visible now, or vice versa.
 *
 *   What about a very tight coupling between the data and the UI.
 *   When a component is created, it's appending itself as an item in the store
 *   Then, when I update the store, I iterate over it, and if I have to update some data
 *   like 'selected' or 'expanded' or 'score'
 *   then I already have a reference to the item that needs to update, so
 *   I can say item.score = 1; item.update()
 *
 */

import localforage from 'localforage';
import {
  EVENTS,
  SCORES,
} from '../utils/constants';

localforage.ready().catch(() => {
  console.warn(`localforage threw an error. If this is during webpack build, everything is OK`);
});

const diskStore = localforage.createInstance({
  name: `know-it-all`,
  version: 1,
});

// this is used to define if an item should be re-rendered
// it should contain anything that can be changed by a user
const serializeItemState = item => [
  item.scoreKey,
  !!item.visible,
  !!item.expanded,
  !!item.selected,
].join(``);

/* eslint-disable no-param-reassign */
const store = {
  data: null,
  listeners: {},
  selectedItem: null,
  childrenCache: {},
  isModalVisible: false,

  init(data) {
    this.data = data;
    this.getScoresFromDisk();
  },

  getItemById(id) {
    return this.data.find(item => item.id === id);
  },

  getChildrenOf(id) {
    if (id in this.childrenCache) {
      return this.childrenCache[id];
    }
    const children = this.data.filter(item => item.parentId === id);

    this.childrenCache[id] = children;
    if (children && children.length) return children;

    return false;
  },

  getUnknowns() {
    const unknowns = [];

    const getItemPath = (item) => {
      if (item.parentId) {
        const parent = this.getItemById(item.parentId);
        return `${getItemPath(parent)} » ${item.name}`;
      }

      return item.name;
    };

    this.data.forEach((item) => {
      if (item.scoreKey === SCORES.LEVEL_1.key) {
        const path = getItemPath(item);
        const topLevel = path.substr(0, path.indexOf(` » `, -2));
        const searchTerm = `${topLevel} ${item.name}`;
        const url = `https://www.google.com.au/search?q=${encodeURIComponent(searchTerm)}`;
        unknowns.push({
          path,
          url,
        });
      }
    });

    return unknowns;
  },

  updateItem(id, data, options = { saveToDisk: true }) {
    const item = this.getItemById(id);

    if (!item) return;

    if (window.APP_DEBUG === true) {
      console.info(`Updated`, item, `with data`, data);
    }

    const prevItemState = serializeItemState(item);
    const scoreChanged = data.scoreKey && data.scoreKey !== item.scoreKey;

    Object.assign(item, data); // gasp, mutability

    const nextItemState = serializeItemState(item);

    // potentially trigger a re-render of the item
    if (item.visible && prevItemState !== nextItemState) {
      this.triggerListener(id, item);
    }

    // potentially trigger a re-render of the score bar
    if (scoreChanged) {
      if (options.saveToDisk) diskStore.setItem(id, data);

      if (this.selectedItem && this.selectedItem.id === id) {
        this.triggerListener(EVENTS.SCORE_CHANGED); // updates the score bar
      }
    }
  },

  getScoresFromDisk() {
    diskStore.iterate((item, id) => {
      // the only thing we want from the store is the score key
      // future version maybe 'expanded' or 'selected'
      if (item.scoreKey) {
        this.updateItem(
          id,
          { scoreKey: item.scoreKey },
          { saveToDisk: false },
        );
      }
    });
  },

  addModules(newModules) {
    const topChildren = [];

    newModules.forEach((module) => {
      topChildren.push(module[0]); // first of each module is the top level, e.g. "SVG"
      this.data = this.data.concat(module);
    });

    this.triggerListener(EVENTS.MODULES_ADDED, topChildren);

    this.getScoresFromDisk();
  },

  selectNextVisibleRow() {
    if (this.selectedItem) {
      if (this.selectedItem.row >= this.data.length - 1) return;

      const nextSelectedItem = this.data
      .slice(this.selectedItem.row + 1)
      .find(item => item.visible);

      if (!nextSelectedItem) return;

      this.changeSelectedItem(nextSelectedItem);
    } else {
      this.changeSelectedItem(this.data[0]);
    }
  },

  selectPrevVisibleRow() {
    if (this.selectedItem) {
      if (this.selectedItem.row < 1) return;

      const nextSelectedItem = this.data
      .slice(0, this.selectedItem.row)
      .reverse()
      .find(item => item.visible);

      this.changeSelectedItem(nextSelectedItem);
    } else {
      this.changeSelectedItem(this.data[0]);
    }
  },

  selectItemById(id) {
    if (this.selectedItem && this.selectedItem.id === id) return;

    this.changeSelectedItem(id);
  },

  changeSelectedItem(idOrItem) {
    const selectedItem = typeof idOrItem === `string`
      ? this.getItemById(idOrItem)
      : idOrItem;

    if (this.selectedItem) {
      this.updateItem(this.selectedItem.id, { selected: false });
    }

    this.updateItem(selectedItem.id, { selected: true });

    this.selectedItem = selectedItem;

    this.triggerListener(EVENTS.SELECTED_ITEM_CHANGED, this.selectedItem);
  },

  expandSelectedItem() {
    if (this.selectedItem && !this.selectedItem.expanded && !this.selectedItem.leaf) {
      this.expandItemById(this.selectedItem.id);
    }
  },

  collapseSelectedItem() {
    if (this.selectedItem && this.selectedItem.expanded) {
      this.collapseItemById(this.selectedItem.id);
    }
  },

  expandItemById(id) {
    const children = this.getChildrenOf(id);
    if (!children) return;

    const item = this.getItemById(id);

    if (item.expanded) return;

    item.expanded = true;

    if (children) {
      children.forEach((child) => {
        child.visible = true;
      });
    }

    this.triggerListener(id, item);
  },

  collapseItemById(id) {
    const item = this.getItemById(id);

    if (item.expanded === false) return;

    item.expanded = false;
    const children = this.getChildrenOf(id);

    if (children) {
      children.forEach((child) => {
        child.visible = false;
      });
    }

    this.triggerListener(id, item);
  },

  scoreSelectedItem(scoreKey) {
    if (this.selectedItem && this.selectedItem.scoreKey !== scoreKey) {
      this.updateItem(this.selectedItem.id, { scoreKey });
    }
  },

  showModal() {
    this.isModalVisible = true;

    this.triggerListener(EVENTS.MODAL_VISIBILITY_CHANGED);
  },

  closeModal() {
    this.isModalVisible = false;

    this.triggerListener(EVENTS.MODAL_VISIBILITY_CHANGED);
  },

  triggerListener(key, payload) {
    const callback = this.listeners[key];

    if (callback) callback(payload);
  },

  listen(id, callback) {
    if (!callback || typeof callback !== `function`) {
      console.warn(`You must pass a function as the second argument to store.listen()`);
    }

    this.listeners[id] = callback;
  },
};

export default store;

/* eslint-enable no-param-reassign */
