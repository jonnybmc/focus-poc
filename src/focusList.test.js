import { RowFocusList, ColumnFocusList } from './focusList';
import Focusable from './focusableItem';

function testFocusListFeatures(Class) {
  describe(`Inherited FocusList features` , () => {
    describe('construction', () => {
      it('creates objects with distinct ids', () => {
        const obj1 = Class.create({});
        const obj2 = Class.create({});
        expect(obj1.id).not.toEqual(obj2.id);
      });
      it('has no active item by default', () => {
        const obj1 = Class.create({});
        expect(obj1.activeItem()).toBeFalsy();
      });
      it('is stateless by default', () => {
        const obj = Class.create({});
        expect(obj.stateful).toBeFalsy();
      });
      it('has no parent by default', () => {
        const obj = Class.create({});
        expect(obj.parent).toBeFalsy();
      });
      it('sets parent to the passed in parent', () => {
        const parent = {};
        const obj = Class.create({ parent });
        expect(obj.parent).toEqual(parent);
      });
      it('is stateful if stateful=true is passed in', () => {
        const obj = Class.create({ stateful: true });
        expect(obj.stateful).toBeTruthy();
      });
    });
    describe('#focus', () => {
      let fc1, fc2, fc3;
      let fcList;
      let obj;
      beforeEach(() => {
        obj = Class.create({});
        fc1 = createFocusableItem();
        fc2 = createFocusableItem();
        fc3 = createFocusableItem();
        fcList = [fc1, fc2, fc3];
        fcList.forEach((fc) => obj.add(fc));
      });
      it('cannot focus if empty', () => {
        obj = Class.create({});
        expect(() => obj.focus()).toThrow();
      });
      it('focuses on the first item by default', () => {
        obj.focus();
        expect(obj.activeItem()).toEqual(fc1);
      });
      it('can focus on specific item index', () => {
        obj.focus(2);
        expect(obj.activeItem()).toEqual(fc3);
        obj.focus(1);
        expect(obj.activeItem()).toEqual(fc2);
      });
      it('returns itself', () => {
        expect(obj.focus()).toEqual(obj);
      });
    });   
    describe('#focusNext', () => {
      let fc1, fc2, fc3;
      let fcList;
      let obj;
      beforeEach(() => {
        obj = Class.create({});
        fc1 = createFocusableItem();
        fc2 = createFocusableItem();
        fc3 = createFocusableItem();
        fcList = [fc1, fc2, fc3];
        fcList.forEach((fc) => obj.add(fc));
      });
      it("returns null if focusNext fails", () => {
        obj = Class.create({});
        expect(obj.focusNext()).toEqual(null);
      });
      it('focuses on the first item by default', () => {
        expect(obj.activeItem()).toBeFalsy();
        obj.focusNext();
        expect(obj.activeItem()).toEqual(fc1);
      })
      it('changes the active item to the next item in line', () => {
        obj.focusNext();
        obj.focusNext();
        expect(obj.activeItem()).toEqual(fc2);
        obj.focusNext();
        expect(obj.activeItem()).toEqual(fc3);
      });
      it('returns itself', () => {
        expect(obj.focusNext()).toEqual(obj);
      });
      it('stays with the current active item if focus action cannot be performed', () => {
        let i = 4; while (i--) obj.focusNext(); 
        expect(obj.focusNext()).toBeFalsy();
        expect(obj.activeItem()).toEqual(fc3);
      });
      it('calls unFocus on the previously focused item', () => {
        const obj = Class.create({});
        obj.add(constructFocusableItem()); obj.add(constructFocusableItem()); 
        obj.focusNext();
        const activeItem = obj.activeItem();
        const spy = jest.spyOn(activeItem, 'unFocus');
        obj.focusNext();
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
      });
    });
    describe('#focusPrev', () => {
      let fc1, fc2, fc3;
      let fcList;
      let obj;
      beforeEach(() => {
        obj = Class.create({});
        fc1 = createFocusableItem();
        fc2 = createFocusableItem();
        fc3 = createFocusableItem();
        fcList = [fc1, fc2, fc3];
        fcList.forEach((fc) => obj.add(fc));
      });
      it("returns null if focusPrev fails", () => {
        expect(obj.focusPrev()).toEqual(null);
      });
      it('changes the active item to the previous item', () => {
        obj.focus(fcList.length - 1);
        obj.focusPrev();
        expect(obj.activeItem()).toEqual(fc2);
        obj.focusPrev();
        expect(obj.activeItem()).toEqual(fc1);
      });
      it('returns itself', () => {
        obj.focus(fcList.length - 1);
        expect(obj.focusPrev()).toEqual(obj);
      });
      it('stays with the current active item if focus action cannot be performed', () => {
        obj.focus();
        expect(obj.focusPrev()).toBeFalsy();
        expect(obj.activeItem()).toEqual(fc1);
      });
      it('calls unFocus on the previously focused item', () => {
        const obj = Class.create({});
        obj.add(constructFocusableItem()); obj.add(constructFocusableItem()); 
        obj.focus(1);
        const activeItem = obj.activeItem();
        const spy = jest.spyOn(activeItem, 'unFocus');
        obj.focusPrev();
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
      });
    });
  });
}

function createFocusableItem({ 
  parent = {}, onFocus = jest.fn(), onUnFocus = jest.fn(), 
} = {}) {
  return Focusable.create({ parent, onFocus, onUnFocus });
}

function constructFocusableItem({ parent = {}, onFocus = jest.fn(), onUnFocus = jest.fn() } = {}) {
  return (new Focusable({ parent, onFocus, onUnFocus }));
}
 
describe('RowFocusList', () => {
  testFocusListFeatures(RowFocusList);
});


describe('ColumnFocusList', () => {
  testFocusListFeatures(ColumnFocusList);
});