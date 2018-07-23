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
  ANALYTICS_STRINGS,
  EVENTS,
  SCORES,
  INHERITED_KEYS,
} from '../utils/constants';
import logTiming from '../utils/logTiming';

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
  data: [],
  listeners: {},
  selectedItem: null,
  childrenCache: {},
  itemCache: {},
  isModalVisible: false,
  scoresLoadedFromDisk: false,
  scoreSummary: {},

  init(data) {
    this.addData(data);

    if (window.APP_META.BROWSER) {
      this.getScoresFromDisk().then(() => {
        logTiming(ANALYTICS_STRINGS.FIRST_MODULE_SCORES);
      });
    }
  },

  addData(newData) {
    this.data = this.data.concat(newData);

    newData.forEach((item) => {
      this.itemCache[item.id] = item;
    });

    newData.forEach((item) => {
      this.updateScoreSummary(item);
    });
  },

  addModules(newModules) {
    newModules.forEach((module, i) => {
      // it can take a few seconds to load all the scores on slow devices
      // break it up into smaller chunks by calling requestIdleCallback()
      requestIdleCallback(() => {
        this.addData(module);
        this.triggerListener(EVENTS.MODULE_ADDED, module[0]);

        if (i === newModules.length - 1) {
          this.getScoresFromDisk().then(() => {
            logTiming(ANALYTICS_STRINGS.ALL_MODULE_SCORES);
          });
        }
      });
    });
  },

  computeInheritRule(newScoreKey, oldScoreKey) {
    if (INHERITED_KEYS.includes(newScoreKey)) {
      return [(item) => true, newScoreKey];
    } else if (INHERITED_KEYS.includes(oldScoreKey)) {
      return [(item) => item.scoreKey === oldScoreKey, SCORES.LEVEL_0.key];
    }
  },

  getItem(idOrItem) {
    if (typeof idOrItem === `string`) {
      return this.itemCache[idOrItem];
    }

    return idOrItem;
  },

  getParent(item) {
    // this caches a reference to an item's parent for performance
    if (item.parentItem) return item.parentItem;
    if (!item.parentId) return null;

    item.parentItem = this.getItem(item.parentId);
    return item.parentItem;
  },

  getChildrenOf(id) {
    // TODO (davidg): actually store references to the children on the item
    if (id in this.childrenCache) {
      return this.childrenCache[id];
    }
    const children = this.data.filter(item => item.parentId === id);

    this.childrenCache[id] = children;
    if (children && children.length) return children;

    return false;
  },

  getScoreCounts() {
    const scoreCounts = Object.keys(SCORES).reduce((result, scoreKey) => {
      result[scoreKey] = {
        score: SCORES[scoreKey],
        count: 0,
      };
      return result;
    }, {});

    this.data.forEach((item) => {
      const scoreKey = item.scoreKey || SCORES.LEVEL_0.key; // "unrated"

      if (!scoreCounts[scoreKey]) {
        console.warn(`${scoreKey} is not a valid score`);
      } else {
        scoreCounts[scoreKey].count += 1;
      }
    });

    // turn the object into an array
    return Object.keys(scoreCounts).map(scoreKey => scoreCounts[scoreKey]);
  },

  getUnknowns() {
    const unknowns = [];

    const getItemPath = (item) => {
      if (item.parentId) {
        const parent = this.getItem(item.parentId);
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

  updateItem(idOrItem, data, options = {}) {
    const saveToDisk = (typeof options.saveToDisk !== `undefined`) ? options.saveToDisk : true;
    const updateDom = (typeof options.updateDom !== `undefined`) ? options.updateDom : true;

    const item = this.getItem(idOrItem);

    if (!item) return;

    if (window.APP_DEBUG === true) {
      console.info(`Updated`, item, `with data`, data);
    }

    const prevItemState = serializeItemState(item);
    const scoreChanged = data.scoreKey && data.scoreKey !== item.scoreKey;

    Object.assign(item, data); // gasp, mutability

    if (saveToDisk) {
      diskStore.setItem(item.id, data);
    }

    if (!updateDom) return;

    const nextItemState = serializeItemState(item);
    this.updateItemDom(item, prevItemState !== nextItemState, scoreChanged, options);
  },

  updateItemDom(item, renderItem, renderScore, options = {}) {
    // potentially trigger a re-render of the item
    if (item.visible && renderItem) {
      this.triggerListener(item.id); // TODO (davidg): `ROW-${item.id}`
    }

    // potentially trigger a re-render of the score bar
    if (renderScore) {
      if (this.selectedItem && this.selectedItem.id === item.id) {
        this.triggerListener(EVENTS.SCORE_CHANGED); // updates the score bar
      }
    }
  },

  updateScore(id, scoreKey, options = {}) {
    const item = this.getItem(id);
    if (!item) return;
    const updateDom = (typeof options.updateDom !== `undefined`) ? options.updateDom : true;

    const oldScoreKey = item.scoreKey;

    // caution: update the score summary before updating the item
    const updatedItems = this.updateScoreSummary(item, scoreKey, oldScoreKey);

    this.updateItem(item, { scoreKey }, options);

    const inheritRule = this.computeInheritRule(scoreKey, oldScoreKey);

    if (inheritRule) {
      const dirtyChildren = [];

      const updateChildren = (parent, test) => {
        const children = this.getChildrenOf(parent.id);
        if (!children) return;

        children.forEach((child) => {
          if (test(child)) {
            dirtyChildren.push(child);
          }

          updateChildren(child, test);
        });
      };

      updateChildren(item, inheritRule[0]);

      const optionsNoDom = Object.assign({}, options);
      optionsNoDom.updateDom = false;

      const updateChild = (child) => {
        this.updateItem(child, { scoreKey: inheritRule[1] }, optionsNoDom);
      };
      const updateChildDom = (child) => {
        this.updateItemDom(child, true, true, options);
      };

      dirtyChildren.forEach(updateChild);

      const visibleChildren = dirtyChildren.filter((child) => child.visible);
      visibleChildren.forEach(updateChildDom);
    }

    if (updateDom) {
      const updateItem = (updatedItem) => {
        this.triggerListener(`PIE-${updatedItem.id}`);
      };

      const visibleItems = updatedItems.filter((item) => item.visible);
      visibleItems.forEach(updateItem);
    }
  },

  updateScoreSummary(item, newScoreKey, oldScoreKey) {
    // TODO (davidg): this is pretty CPU intensive - web worker?
    const newItem = !newScoreKey && !oldScoreKey;
    // the score summary holds the aggregate scores for non-leaf nodes
    newScoreKey = newScoreKey || SCORES.LEVEL_0.key;
    oldScoreKey = oldScoreKey || SCORES.LEVEL_0.key;
    const updatedItems = [];

    const updateSummary = (parent, inheritRule) => {
      const children = this.getChildrenOf(parent.id);
      if (!children) return; // we're at the bottom
      updatedItems.push(parent);

      this.scoreSummary[parent.id] = this.scoreSummary[parent.id] || {};
      Object.keys(SCORES).forEach((scoreKey) => {
        this.scoreSummary[parent.id][scoreKey] = children
        .map((child) => {
          this.scoreSummary[child.id] = this.scoreSummary[child.id] || {};
          const scoreSummary = this.scoreSummary[child.id][scoreKey] || 0;
          let newValue = child.scoreKey || SCORES.LEVEL_0.key;

          if (child === item) {
            newValue = newScoreKey;
          } else if (inheritRule) {
            if (inheritRule[0](child)) {
              newValue = inheritRule[1];
            }
          }

          return newValue === scoreKey ? scoreSummary + 1 : scoreSummary;
        })
        .reduce((a, b) => a + b, 0);
      });
    };
    const updateChildrenScore = (parent, inheritRule) => {
      const children = this.getChildrenOf(parent.id);
      if (!children) return; // we're at the bottom

      children.forEach((child) => {
        updateChildrenScore(child, inheritRule);
      });

      updateSummary(parent, inheritRule);
    };
    const updateParentScore = (child) => {
      const parent = this.getParent(child);
      if (!parent) return; // we're at the top

      updateSummary(parent);
      updateParentScore(parent);
    };

    const inheritRule = this.computeInheritRule(newScoreKey, oldScoreKey);

    if (inheritRule) {
      updateChildrenScore(item, inheritRule);
    }

    updateParentScore(item);

    return updatedItems;
  },

  getScoreSummary(id) {
    const scoreSummary = this.scoreSummary[id];
    if (!scoreSummary) return false;

    const scoreOrder = [4, 1, 2, 3, 0];
    const results = [];
    let total = 0;

    scoreOrder.forEach((scoreInt) => {
      const score = SCORES[`LEVEL_${scoreInt}`];
      const scoreCount = scoreSummary[score.key];

      if (scoreCount) {
        total += scoreCount;

        results.push({
          count: scoreCount,
          score,
        });
      }
    });

    return { total, results };
  },

  getScoresFromDisk() {
    return diskStore.iterate((data, id) => {
      // the only thing we want from the store is the score key
      // future version maybe 'expanded' or 'selected'
      if (data.scoreKey) {
        this.updateScore(
          id,
          data.scoreKey,
          { saveToDisk: false, updateDom: false },
        );
      }
    }).then(() => {
      this.scoresLoadedFromDisk = true;

      this.data.forEach((item) => {
        // since potentially every row/pie chart may have changed
        // just re-render each of the top level items
        if (!item.parentId) this.triggerListener(item.id);
      });
    });
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

  selectNoItem() {
    this.changeSelectedItem(null);
  },

  changeSelectedItem(idOrItem) {
    const selectedItem = this.getItem(idOrItem);

    if (this.selectedItem) {
      this.updateItem(this.selectedItem.id, { selected: false });
    }

    if (selectedItem) { // might be null
      this.updateItem(selectedItem.id, { selected: true });
    }

    this.selectedItem = selectedItem;

    this.triggerListener(EVENTS.SELECTED_ITEM_CHANGED);
  },

  expandOrNavigateToChild() {
    if (this.selectedItem && !this.selectedItem.expanded && !this.selectedItem.leaf) {
      this.expandItemById(this.selectedItem.id);
    } else if (this.selectedItem && !this.selectedItem.leaf) {
      this.selectNextVisibleRow();
    }
  },

  collapseOrNavigateToParent() {
    if (this.selectedItem && this.selectedItem.expanded) {
      this.collapseItemById(this.selectedItem.id);
    } else if (this.selectedItem && this.selectedItem.parentId) {
      this.changeSelectedItem(this.selectedItem.parentId);
    }
  },

  expandItemById(id) {
    const children = this.getChildrenOf(id);
    if (!children) return;

    const item = this.getItem(id);

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
    const item = this.getItem(id);

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
      this.updateScore(this.selectedItem.id, scoreKey);
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

  triggerListener(id, payload) {
    const callbacks = this.listeners[id];

    if (callbacks && callbacks.length) {
      callbacks.forEach(callback => callback(payload));
    }
  },

  listen(id, callback) {
    if (!callback || typeof callback !== `function`) {
      console.warn(`You must pass a function as the second argument to store.listen()`);
    }

    this.listeners[id] = this.listeners[id] || [];
    this.listeners[id].push(callback);
  },
};

export default store;

/* eslint-enable no-param-reassign */
