import { FocusableError, createId } from './util';


export default class Focusable {
  constructor({ parent = null, onFocus, onUnFocus, onOK, leftPos }) {
    if (!parent) {
      FocusableError.throw("Cannot instantiate an item without a parent");
    }
    if (!onFocus) { 
      FocusableError.throw("a focus callback function is required");
    } 
    if (!onUnFocus) {
      FocusableError.throw("an unFocus callback function is required");
    }

    this.id = createId();
    this.onFocus = onFocus;
    this.onUnFocus = onUnFocus;
    this.onOK = onOK;
    this.parent = parent;
    this.leftPos = leftPos;
  }

  static create({ parent, onFocus, onUnFocus, onOK, leftPos }) {
    return Object.freeze(new Focusable({ parent, onFocus, onUnFocus, onOK, leftPos }));
  }

  focus() {
    this.onFocus();
    return this;
  }

  unFocus() {
    this.onUnFocus();
    return this;
  }

  enter() {
    this.onOK();
    return this;
  }
}