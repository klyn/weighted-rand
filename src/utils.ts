/**
 * Finds the number of decimal places in a 'number'.
 *
 * @param {number} x - The number in question.
 * @returns {number|undefined} - The number of decimal places.
 */
export function countDecimalPlaces(x: number) {
  // - return 'undefined' if x is not a type of number
  if (typeof x !== "number") {
    return undefined;
  }

  // - parse x as a Number of a base 10 to prevent subtle errors
  const y = Number(x);

  // - return 'undefined' if for whatever reason y is not a Number
  if (Number.isNaN(y)) {
    return undefined;
  }

  // - check if the number is already a whole number
  // - if yes, return 0
  if (y % 1 == 0) {
    return 0;
  }

  // - convert y to a string
  const str = y.toString();

  // - check if the string representation contains a '.'
  // - if not, this could be an edge-case because a whole
  //   number would have returned earlier
  if (str.indexOf(".") == -1) {
    return "undefined";
  }

  // - if string contains a dot, split it from the dot
  // - take the second part
  const dec = str.split(".")[1];

  // - do NOT parse the decimal count as an integer or case
  //   like '.01' will return 1 instead of 2
  // - instead, return the string length of the dec
  return dec.length;
}

/**
 * Check whether a value is an object {} or not
 *
 * @param {any} x - Value to be examined
 * @returns {boolean} - Whether the value is an object or not
 */
export function isObject(x: any): boolean {
  // - handle undefined & null values
  if (!x) {
    return false;
  }

  // - type of x
  const type = typeof x;

  // - handle all primitive types and functions/classes
  if (type != "object") {
    return false;
  }

  // - handle arrays
  if (Array.isArray(x)) {
    return false;
  }

  return true;
}
