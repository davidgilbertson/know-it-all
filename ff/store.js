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

import { EVENTS } from './utils/constants';

/* eslint-disable no-param-reassign */
const store = {
  data: null,
  listeners: {},
  selectedItem: null,
  childrenCache: {},

  init(data) {
    this.data = data;
  },

  addModules(newModules) {
    const topChildren = [];

    newModules.forEach((module) => {
      topChildren.push(module[0]); // first of each module is the top level, e.g. "SVG"
      this.data = this.data.concat(module);
    });

    const callback = this.listeners[EVENTS.MODULES_ADDED];
    if (callback) callback(topChildren);
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

  updateItem(id, data, triggerListener = true) {
    const item = this.getItemById(id);

    Object.assign(item, data); // gasp, mutability

    if (window.APP_DEBUG === true) {
      console.info(`Updated`, item, `with data`, data);
    }

    if (triggerListener) this.triggerListener(id);
  },

  selectNextVisibleRow() {
    if (this.selectedItem) {
      if (this.selectedItem.row >= this.data.length - 1) return;

      const nextSelectedItem = this.data
      .slice(this.selectedItem.row + 1)
      .find(item => item.visible);

      if (!nextSelectedItem) return;

      this.updateItem(this.selectedItem.id, { selected: false });

      this.selectedItem = nextSelectedItem;
    } else {
      this.selectedItem = this.data[0];
    }

    this.updateItem(this.selectedItem.id, { selected: true });
  },

  selectPrevVisibleRow() {
    if (this.selectedItem) {
      if (this.selectedItem.row < 1) return;

      this.updateItem(this.selectedItem.id, { selected: false });

      this.selectedItem = this.data
      .slice(0, this.selectedItem.row)
      .reverse()
      .find(item => item.visible);
    } else {
      this.selectedItem = this.data[0];
    }

    this.updateItem(this.selectedItem.id, { selected: true });
  },

  getItemById(id) {
    return this.data.find(item => item.id === id);
  },

  selectItemById(id) {
    if (this.selectedItem && this.selectedItem.id === id) {
      return;
    }

    this.updateItem(id, { selected: true });

    if (this.selectedItem) {
      this.updateItem(this.selectedItem.id, { selected: false });
    }

    this.selectedItem = this.getItemById(id);
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

    this.triggerListener(id);
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

    this.triggerListener(id);
  },

  scoreSelectedItem(scoreKey) {
    if (this.selectedItem && this.selectedItem.scoreKey !== scoreKey) {
      this.updateItem(this.selectedItem.id, { scoreKey });
    }
  },

  triggerListener(id) {
    const callback = this.listeners[id];

    if (callback) callback(this.getItemById(id));
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
