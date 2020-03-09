import Focusable from './focusableItem'

describe('focusableItem', () => {
  const parent = {};
  describe('construction', () => {
    const onFocusCB = jest.fn();
    const onUnFocusCB = jest.fn();
    it('cannot be constructed without onFocus cb', () => {
      expect(() => Focusable.create({ parent, onUnFocus })).toThrow();
    });
    it('cannot be constructed without onUnFocus cb', () => {
      expect(() => Focusable.create({ parent, onFocus: onFocusCB })).toThrow();
    });
    it('cannot be constructed without parent', () => {
      expect(() => Focusable.create({ onFocus: onFocusCB, onUnFocus: onUnFocusCB })).toThrow();
    });
    it("is constructed without errors if there all required args are passed in", () => {
      expect(() => Focusable.create({ parent, onFocus: onFocusCB, onUnFocus: onUnFocusCB })).not.toThrow();
    });
  });
  describe('#focus', () => {
    const onFocusCB = jest.fn();
    const onUnFocusCB = jest.fn();
    it('calls the onFocus cb', () => {
      const fc = Focusable.create({ parent, onFocus: onFocusCB, onUnFocus: onUnFocusCB });
      fc.focus();
      expect(onFocusCB).toHaveBeenCalled();
    });
    it('returns itself', () => {
      const fc = Focusable.create({ parent, onFocus: onFocusCB, onUnFocus: onUnFocusCB });
      expect(fc.focus()).toEqual(fc);
    });
  });
  describe('#unFocus', () => {
    const onFocusCB = jest.fn();
    const onUnFocusCB = jest.fn();
    it('calls the onUnFocus cb', () => {
      const fc = Focusable.create({ parent, onFocus: onFocusCB, onUnFocus: onUnFocusCB });
      fc.unFocus();
      expect(onUnFocusCB).toHaveBeenCalled();
    });
    it('returns itself', () => {
      const fc = Focusable.create({ parent, onFocus: onFocusCB, onUnFocus: onUnFocusCB });
      expect(fc.unFocus()).toEqual(fc);
    });
  });
  describe("#enter", () => {
    const onFocusCB = jest.fn();
    const onUnFocusCB = jest.fn();
    const onOK = jest.fn()
    it('calls the onOK cb', () => {
      const fc = Focusable.create({ parent, onFocus: onFocusCB, onUnFocus: onUnFocusCB, onOK });
      fc.enter();
      expect(onOK).toHaveBeenCalled();
    });
    it('returns itself', () => {
      const fc = Focusable.create({ parent, onFocus: onFocusCB, onUnFocus: onUnFocusCB, onOK });
      expect(fc.enter()).toEqual(fc);
    });
  });
});