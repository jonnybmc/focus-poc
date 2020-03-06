import React from 'react';

export const FocusContext = React.createContext({  });
const KEYS = Object.freeze({
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  // OK: 13,
});
const KEY_ACTIONS = Object.freeze({
  [KEYS.UP]: 'goUp',
  [KEYS.DOWN]: 'goDown',
  [KEYS.LEFT]: 'goLeft',
  [KEYS.RIGHT]: 'goRight',
});

const NAV_DIRECTION = Object.freeze({
  UP_DOWN: Symbol('UP_DOWN'), // is a row
  LEFT_RIGHT: Symbol('LEFT_RIGHT'), // is a column
});

let focusManager_ = null;
export function getFocusManager() {
  if (!focusManager_) focusManager_ = FocusManager.create();
  return focusManager_;
}

let focusableIdGen = 0;
class Focusable {
  constructor(parentId = null) {
    this._id_ = ++focusableIdGen;
    this._parent = parentId;
  }

  static create(parentId = null) {
    return new Focusable(parentId);
  }

  get id() {
    return this._id_;
  }

  get parent() {
    return this._parent;
  }

  set parent(val) {
    this._parent = val;
  }
}

class FocusableError extends Error {
  static throw(msg) {
    throw new FocusableError(msg);
  }
}

export class FocusableItem extends React.Component {
  static contextType = FocusContext;
  state = {}
  componentWillMount() {
    console.log('focusable context', this.context);
    // const focusManager = getFocusManager();
    const collectionId = this.context.collectionId;
    const focusableEl = Focusable.create(collectionId);
    // getFocusManager().add(focusableEl);
    this.setState({
      id: focusableEl.id
    });
  }

  render() {
    console.log('there is an active item', this.context);
    return (
      <FocusContext.Consumer>
        {({ activeItem }) => (
          <div className={this.state.id === activeItem ? 'focused' : ''}>
            {this.props.children}
          </div>
        )}
      </FocusContext.Consumer>

    );
  }
}

class FocusableCollection extends Focusable {
  constructor(parentId = null, navDirection = NAV_DIRECTION.UP_DOWN) {
    if (!NAV_DIRECTION[navDirection]) FocusableError.throw("Cannot instantiate Focusable object without a valid navigation direction");

    super(parentId);
    this._children = [];
    this.activeIndex = -1;
    this._navDirection = navDirection;
  }

  get activeElement() {
    if (this.activeIndex >= 0)
      return this._children[this.activeIndex];
    else
      return {};
  }

  focus(index = 0) {
    const len = this._children.length;
    if (0 <= index && index < len) {
      this.activeIndex = index;
    } else {
      FocusableError.throw("Focus index out of range");
    }
  }

  unFocus() {
    this.activeIndex = -1;
  }

  isRow() {
    return this._navDirection === NAV_DIRECTION.UP_DOWN;
  }

  focusNext() {
    if (this.activeIndex < this._children.length) {
      this.activeIndex++;
      return this.activeElement.id;
    }
    return false;
  }

  focusPrev() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      return this.activeElement.id;
    }
    return false;
  }

  add(childId) {
    this._children.push(childId);
  }

  remove(childId) {
    for (let i = 0, len = this._children.length; i < len; i++) {
      if (this._children[i] === childId) {
        this._children.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  goUp() {
    return (this._navDirection === NAV_DIRECTION.UP_DOWN)
      && this.focusPrev();
  }

  goDown() {
    return (this._navDirection === NAV_DIRECTION.UP_DOWN)
      && this.focusNext();
  }

  goLeft() {
    return (this._navDirection === NAV_DIRECTION.LEFT_RIGHT)
      && this.focusPrev();
  }

  goRight() {
    return (this._navDirection === NAV_DIRECTION.LEFT_RIGHT)
      && this.focusNext();
  }
}

class PersistantFocusableCollection extends FocusableCollection {
  constructor(parentId = null, navDirection) {
    super(parentId, navDirection);
  }

  focus() {}
  unFocus() {}
}

export class FocusableList extends React.Component {
  static contextType = FocusContext;
  state = {
    activeItem: null,
    name: Symbol(),
  };
  constructor(props) {
    super(props);

    this.updateActiveElement = this.updateActiveElement.bind(this);
  }
  componentWillMount() {
    const navDirection = this.props.isRow ? NAV_DIRECTION.UP_DOWN : NAV_DIRECTION.LEFT_RIGHT;
    const parentId = this.context.collectionId;
    const focusableCol = this.props.isPersistant
      ? PersistantFocusableCollection.create(parentId, navDirection)
      : FocusableCollection.create(parentId, navDirection);
    window.focusableCol = focusableCol;
    window.focusManager = getFocusManager();
    getFocusManager().addCollection(focusableCol);

    this.setState({
      id: focusableCol.id
    });

    getFocusManager().subscribe(this.state.name,this.updateActiveElement);
  }

  componentWillUnmount() {
    getFocusManager().unSubscribe(this.state.name);
  }

  updateActiveElement(activeId) {
    this.setState({
      activeItem: activeId,
    });
  }

  render() {
    const { id, activeItem } = this.state;
    return (
      <FocusContext.Provider value={{ collectionId: id, activeItem }}>
        {this.props.children}
      </FocusContext.Provider>
    );
  }
}

class FocusManagerError extends Error {
  static throw(msg) {
    throw new FocusManagerError(msg);
  }
}

class FocusManager {
  constructor() {
    this._root = null;
    this.activeCollection = null;
    this._elements = new Map();
    this._listeners = new Map();
    this.handleKeyClick = this.handleKeyClick.bind(this);
    window.addEventListener('keydown', this.handleKeyClick);
  }

  subscribe(key, fn) {
    this._listeners.set(key, fn);
  }

  unSubscribe(key) {
    this._listeners.delete(key);
  }

  publishUpdate(activeEl) {
    for (const fn of this._listeners.values()) {
      fn(activeEl);
    }
  }

  handleKeyClick(ev) {
    let action;
    console.log('we need to handle click');
    if (KEYS[ev.keyCode]) {
      action = KEY_ACTIONS[ev.keyCode];
      let current = this.activeCollection;
      while (current) {
        const newFocusElId = current[action]();
        if (!newFocusElId) {
          current = this.getElement(current.parent);
        } else {
          const el = this.getElement(newFocusElId);
          this.activeCollection = this.getElement(el.parent);
          this.publishUpdate(newFocusElId);
        }
      }
    }
  }

  static create() {
    return new FocusManager();
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyClick);
  }

  getElement(id) {
    return this._elements.get(id);
  }

  addCollection(col) {
    if (!this._root) {
      this._root = col.id;
      this.activeCollection = col.id;
    } else if (!col.parent) {
      FocusManagerError.throw("A non-root collection must have a parent");
    }
    this._elements.set(col.id, col);
  }

  add(item) {
    if (!item.parent) {
      FocusManagerError.throw("Cannot add focusable item without parent");
    } else {
      const parent = this.getElement(item.id);
      parent.add(item.id);
      this._elements.set(item.id, item);
    }
  }

  remove(id) {
    this._elements.delete(id);
  }
}
