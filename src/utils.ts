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

/**
 * Simple assert function to check whether a value is of an
 * expected type or not.
 *
 * @param {any} thing - The value we like to check the type of
 * @param {string} expectedType - The typeof operator result for
 * the expected type
 * @returns {never|undefined} - Throws an exception, thus, returning
 * never in case of failure, otherwise it will return undefined
 */
export function assertType(
  thing: any,
  expectedType: string
): never | undefined {
  // - type of the value that we are checking
  const typeOfThing = typeof thing;

  // - the expectedType should always be a string
  if (typeof expectedType !== "string") {
    assertType(expectedType, "string");
  }

  // - check if the type is what we expect and like
  if (typeOfThing !== expectedType) {
    // - string template for the error message
    const errorMessage = `Was expecting a '${expectedType}', but got a '${typeOfThing}' instead.`;
    // - throw an exception
    throw new TypeError(errorMessage);
  }

  // - the type of thing is satisfactory, no need for any specific
  //   return values. returing undefined here just for the sake of
  //   clarity.
  return undefined;
}
