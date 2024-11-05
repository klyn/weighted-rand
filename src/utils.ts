/**
 * Check whether a value is a data object {} or not
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
