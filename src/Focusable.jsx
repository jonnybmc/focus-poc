import React from 'react';
import Focusable from './focusableItem';
import { RowFocusList, ColumnFocusList } from './focusList';

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

export class FocusableItem extends React.Component {
  static contextType = FocusContext;
  state = {};
  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onUnFocus = this.onUnFocus.bind(this);
    this.onOK = this.onOK.bind(this);
  }

  componentWillMount() {
    console.log('focus item');
    const parent = this.context.list;
    const focusObj = Focusable.create({ 
      parent,
      onFocus: this.onFocus,
      onUnFocus: this.onUnFocus,
      onOK: this.onOK,
    });
    parent.add(focusObj);
    if (this.props.withFocus) {
      FocusManager.instance().focus(parent, focusObj);
    }
  }

  onFocus = () => {
    this.setState({
      hasFocus: true,
    });
  };

  onUnFocus = () => {
    this.setState({
      hasFocus: false,
    });
  };

  onOK() {
    console.log('pressed enter');
  }

  

  render() {
    return (
      <div className={this.state.hasFocus ? 'focused' : ''}>
        {this.props.children}
      </div>
    );
  }
}

export class FocusableList extends React.Component {
  static contextType = FocusContext;

  componentWillMount() {
    const ctx = this.context;
    const type = this.props.isRow ? RowFocusList : ColumnFocusList;
    const list = type.create({
      parent: ctx.list,
      stateful: this.props.stateful,
      name: this.props.name,
    });
    this.setState({
      list
    });
    if (ctx.list) ctx.list.add(list);
    FocusManager.instance().add(list, this.props.withFocus);
  }

  render() {
    const { list } = this.state;
    return (
      <FocusContext.Provider value={{ list }}>
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

function getParentId(el) {
  try {
    const ret = el.parent.id;
    return ret;
  } catch (e) {
    return null;
  }
}

// function unFocusParent(el) {
//   try {
//     const parent = el.parent;
//     parent.un
//   } catch (e) {

//   }
// }

class FocusManager {
  constructor() {
    this._root = null;
    this.activeItem = null;
    this._elements = new Map();
    this.handleKeyClick = this.handleKeyClick.bind(this);
    window.addEventListener('keydown', this.handleKeyClick);
  }

  handleKeyClick(ev) {
    if (KEY_ACTIONS[ev.keyCode]) {
      const movement = KEY_ACTIONS[ev.keyCode];
      console.log('action', movement);
      let current = this.activeItem.parent;
      console.log('current collection has action', current[movement])
      // const currentActiveItem = this.activeCollection.activeItem();
      while (current) {
        const collectionCanMakeMovement = current[movement];
        console.log('on collection', current.name);
        if (collectionCanMakeMovement) {
          const newFocusItem = current[movement]();
          console.log('there is a new focus item', newFocusItem);
          if (newFocusItem) {
            const onDifferentCollection = getParentId(current) !== getParentId(this.activeItem);
            if (onDifferentCollection) this.activeItem.parent.unFocus();
            this.activeItem = newFocusItem;
          }        
        }
        
        current = current.parent;
      }
    }
  }

  static instance() {
    return FocusManager._obj_ = FocusManager._obj_ || new FocusManager();
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyClick);
  }

  add(col, withFocus) {
    if (!this._root) {
      this._root = col;
    } else if (!col.parent) {
      FocusManagerError.throw("A non-root collection must have a parent");
    }
    this._elements.set(col.id, col);
  }

  remove(col) {
    const id = col.id || col;
    this._elements.delete(id);
  }

  focus(col, item) {
    const ret = col.activate(item);
    if (ret) this.activeItem = item;
  }
}

window.fc = FocusManager.instance();