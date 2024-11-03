// -- core functionality, types and utility functions

import { isObject } from "./utils";

/**
 * Type to represent probabilities
 *
 * key: ID
 * value: Probability
 */
export type Weights = {
  [key: string]: number;
};

/**
 * Once provided with at least two IDs and their relative
 * probability to be picked randomly, the function will choose
 * and return a single key from the weights argument that
 * represents the chosen random ID based on the provided relative
 * probabilities.
 *
 * @param {Weights} weights - ID and probability object
 * @returns {string|boolean} - A valid key from the weights argument
 */
export function wrand(weights: Weights): string | boolean {
  // - only accept an Object as the weights argument
  if (!isObject(weights)) {
    return false;
  }

  // - get the list of IDs from our weights object
  const ids = Object.keys(weights);

  // - if the weights object contains only one element,
  //   return the ID
  if (ids.length == 1) {
    return ids[0];
  }

  // todo
  // count the number of decimal places of the weights
  // multiply if need to get integers
  // create a map

  return "pass";
}
