import { FocusListError, createId } from './util';

const INVALID_INDEX = -1;
const FIRST_ITEM = 0;
class FocusList {
  constructor({ parent, stateful }) {
    this.children = [];
    this.activeIndex = INVALID_INDEX;
    this.parent = parent;
    this.stateful = stateful;
    this.id = createId();
  }

  static create({ parent = null, stateful = false }) {
    return new FocusList({ parent, stateful });
  }

  focus(index = FIRST_ITEM) {
    if (!this.children.length) FocusListError.throw("Cannot focus on empty list");
    if (this.activeItem()) this._unFocusCurrent();
    this.activeIndex = index;
    const ret = this.children[this.activeIndex].focus();

    return ret instanceof FocusList ? ret : this;
  }

  activate(itemToFocus) {
    const itemIdx = this.children.findIndex(item => item.id === itemToFocus.id);
    if (itemIdx >= 0) {
      return this.focus(itemIdx);
    }
    return null;
  }

  unFocus() {
    if (!this._indexInRange(this.activeIndex)) return null;
    
    const ret = this.children[this.activeIndex].unFocus();
    this.activeIndex = this.stateful ? this.activeIndex : INVALID_INDEX;
    return ret;
  }

  _unFocusCurrent() {
    this.activeItem().unFocus();
  }

  _indexInRange(i) {
    return 0 <= i && i < this.children.length;
  }

  focusNext() {
    let index = this.activeIndex;
    const newIndex = index + 1;
    const newItem = this.children[newIndex];
    if (!this._indexInRange(newIndex)) return null;

    if (newItem) {
      if (this._indexInRange(index)) this._unFocusCurrent();
      return this.focus(newIndex);
    } else {
      return null;
    }
  }

  focusPrev() {
    let index = this.activeIndex;
    const newIndex = index - 1;
    const newItem =  this.children[newIndex];
    if (!this._indexInRange(newIndex)) return null;

    if (newItem) {
      this._unFocusCurrent();
      return this.focus(newIndex);
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

  contains(item) {
    return !!this.children.find((fcItem) => fcItem.id === item.id);
  }
}


export class RowFocusList extends FocusList {
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

export class GridFocusList extends FocusList {
  constructor(opts) {
    super(opts);
    this.itemsPerRow = INVALID_INDEX;
    this.activeRow = INVALID_INDEX;
    this.activeCol = INVALID_INDEX;
    this.wrapLeft = opts.wrapLeft;
  }

  static create(opts) {
    return new GridFocusList(opts);
  }

  add(item) {
    if (!this.children.length) {
      this.leftMostItemPos = item.leftPos;
      const rowOne = [item];
      this.children.push(rowOne)
    } else if (item.leftPos === this.leftMostItemPos) {
      const lastRowLength = this.children[this.children.length - 1].length;
      this.itemsPerRow = lastRowLength;
      const nextRow = [item];
      this.children.push(nextRow);
    } else {
      const currentRowIndex = this.children.length - 1;
      const currentRow = this.children[currentRowIndex];
      const itemsPerRow = this.itemsPerRow;

      if (currentRow.length === itemsPerRow) {
        const newRow = [item];
        this.children.push(newRow);
      } else {
        this.children[currentRowIndex].push(item);
      }
    }
  }

  contains(item) {
    return !!this.children.some(fcRow => {
      return fcRow.some(fcItem =>fcItem.id === item.id);
    });
  }

  activeItem() {
    const activeRow = this.children[this.activeRow];
    if (activeRow) {
      return activeRow[this.activeCol];
    }
  }

  focus(row = 0, col = 0) {
    if (!this.children.length) FocusListError.throw("Cannot focus on empty list");
    const activeItem = this.activeItem();
    if (activeItem) activeItem.unFocus();

    this.activeRow = row;
    this.activeCol = col;
    const ret = this.children[row][col];
    ret.focus();
    return ret instanceof FocusList ? ret : this;
  }

  unFocus() {
    const activeItem = this.activeItem();
    this.activeCol = INVALID_INDEX;
    this.activeRow = INVALID_INDEX;
    if (activeItem) return activeItem.unFocus();
    return null;
  }

  find(item) {
    for (let row = 0; row < this.children.length; row++) {
      for (let col = 0; col < this.children[row].length; col++) {
        if (this.children[row][col].id === item.id) return [row, col];
      }
    }
    return [INVALID_INDEX, INVALID_INDEX];
  }

  activate(itemToFocus) {
    const [row, col] = this.find(itemToFocus);
    if (row !== INVALID_INDEX) {
      return this.focus(row, col);
    }
    return null;
  }

  goLeft() {
    const onFirstRow = this.activeRow === FIRST_ITEM;
    const onFirstCol = this.activeCol === FIRST_ITEM;
    let ret = null;
    if (!this.wrapLeft && (onFirstCol && !onFirstRow)) {
      return ret;
    }

    let row = this.children[this.activeRow];
    const activeCol = this.activeCol;
    const prevCol = activeCol - 1;
    const prevRow = this.activeRow - 1;
    const lastColIndex = row.length - 1;
    const newItem = row[prevCol];
    
    if (newItem) {
      ret = this.focus(this.activeRow,prevCol);
    } else {
      row = this.children[prevRow];
      if (row) {
        const lastEl = row[lastColIndex];
        if (lastEl) {
          ret = this.focus(prevRow, lastColIndex);
        } 
      } 
    }
    return ret;
  }

  goRight() {
    let row = this.children[this.activeRow];
    const activeCol = this.activeCol;
    const nextCol = activeCol + 1;
    const nextRow = this.activeRow + 1;
    const newItem = row[nextCol];
    let ret = null;
    if (newItem) {
      ret = this.focus(this.activeRow, nextCol);
    } else {
      row = this.children[nextRow];
      if (row) {
        const nextRowFirstEl = row[FIRST_ITEM];
        if (nextRowFirstEl) {
          ret = this.focus(nextRow);
        } 
      } 
    }
    return ret;
  }

  goUp() {
    const activeCol = this.activeCol;
    const prevRow = this.children[this.activeRow - 1];
    let ret = null;
    if (prevRow) {
      ret = this.focus(this.activeRow - 1, activeCol);
    }
    return ret;
  }

  goDown() {
    const activeCol = this.activeCol;
    const nextRow = this.children[this.activeRow + 1];
    let ret = null;
    if (nextRow) {
      if (nextRow[activeCol]) {
        ret = this.focus(this.activeRow + 1, activeCol);
      } else {
        const newItem = nextRow[nextRow.length - 1];
        if (newItem) {
          ret = this.focus(this.activeRow + 1, nextRow.length - 1);
        } 
      }
    } 
  }
}