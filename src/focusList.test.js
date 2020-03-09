import { RowFocusList, ColumnFocusList } from './focusList';
import Focusable from './focusableItem';

function testFocusListFeatures(Class) {
  describe(`FocusList [${Class.name}]` , () => {
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
  });
}

function createFocusableItem({ 
  parent = {}, onFocus = jest.fn(), onUnFocus = jest.fn(), 
} = {}) {
  return Focusable.create({ parent, onFocus, onUnFocus });
}
 
describe('RowFocusList', () => {
  testFocusListFeatures(RowFocusList);
  describe('#focus', () => {
    test('', () => {

    });
    it('focuses', () => {
      
    });
  });
});


describe('ColumnFocusList', () => {
  testFocusListFeatures(ColumnFocusList);
});