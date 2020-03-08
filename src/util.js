export class FocusableError extends Error {
  static throw(msg) {
    throw new FocusableError(msg);
  }
}

export class FocusListError extends Error {
  static throw(msg) {
    throw new FocusListError(msg);
  }
}

export function createId() {
  return Symbol();
}