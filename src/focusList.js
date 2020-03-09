import { FocusListError, createId } from './util';

const INVALID_INDEX = -1;
const FIRST_ITEM = 0;
class FocusList {
  constructor({ parent, stateful, name }) {
    this.children = [];
    this.activeIndex = INVALID_INDEX;
    this.parent = parent;
    this.stateful = stateful;
    this.id = createId();
    this.name = name;
  }

  static create({ parent = null, stateful = false, name }) {
    return new FocusList({ parent, stateful, name });
  }

  focus(index = FIRST_ITEM) {
    if (this.children.length) {
      this.activeIndex = index;
      this.children[this.activeIndex].focus();
      return this;
    } else {
      FocusListError.throw("Cannot focus on empty list");
    }
  }

  activate(itemToFocus) {
    const itemIdx = this.children.findIndex(item => item.id === itemToFocus.id);
    if (itemIdx >= 0) {
      return this.focus(itemIdx);
    }
    return null;
  }

  unFocus() {
    const ret = this.children[this.activeIndex].unFocus();
    this.activeIndex = this.stateful ? this.activeIndex : INVALID_INDEX;
    return ret;
  }

  _unFocusCurrent() {
    const currentActiveItem = this.activeItem();
    if (currentActiveItem) currentActiveItem.unFocus();
  }

  focusNext() {
    let index = this.activeIndex;
    const newItem = this.children[index + 1];
    if (newItem) {
      this._unFocusCurrent();
      ++this.activeIndex;
      return newItem.focus();
    } else {
      return null;
    }
  }

  focusPrev() {
    let index = this.activeIndex;
    const newItem =  this.children[index - 1];
    if (newItem) {
      this._unFocusCurrent();
      --this.activeIndex;
      return newItem.focus();
    } else {
      return null;
    }
  }

  add(item) {
    this.children.push(item);
  }

  remove(item) {
    const id = item.id || item;
    this.children = this.children.filter((fcItem) => fcItem.id === id);
  }

  activeItem() {
    return this.children[this.activeIndex];
  }
}


export class RowFocusList extends FocusList {
  constructor(opts) {
    super(opts);
  }

  static create(opts) {
    return new RowFocusList(opts);
  }

  static createStateFulList(opts) {
    return new RowFocusList({ ...opts, stateful: true });
  }

  goUp() {
    return this.focusPrev();
  }

  goDown() {
    return this.focusNext();
  }
}

export class ColumnFocusList extends FocusList {
  constructor(opts) {
    super(opts);
  }

  static create(opts) {
    return new ColumnFocusList(opts);
  }

  static createStateFulList(opts) {
    return new ColumnFocusList({ ...opts, stateful: true });
  }

  goLeft() {
    return this.focusPrev();
  }

  goRight() {
    return this.focusNext();
  }
}