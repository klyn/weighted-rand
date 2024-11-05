import { assertType } from "../utils";
import { Weights, wrand } from "./wrand";

/**
 * Weighted boolean probability function. Accepts a value
 * for probability and a total value, and then return a
 * true or false result. True means that based on a pseudo-
 * random draw and according the probability that was provided,
 * the result was positive, otherwise the probability failed to
 * happen.
 *
 * For example, wbp(70, 100) means pick a draw where the chance
 * of win is 70%.
 *
 * @param {number} probability - The nominal probability
 * @param {number} total - The actual probability will be calculated
 * according to this number
 * @param {number} shuffle - Number of shuffles before a draw. Default
 * is 3. Set 0 for skipping the shuffle
 * @returns {boolean|never} - True in case of win, False in case lose
 * and may not return if an exception is thrown due to an error
 */
export function wbp(
  probability: number,
  total: number,
  shuffle: number = 3
): boolean | never {
  // - both probability and total must be of type number
  assertType(probability, "number");
  assertType(total, "number");
  assertType(shuffle, "number");

  // - if probability and total are equal, then return true
  if (probability === total) {
    return true;
  }

  // - probability should always be lower than the total
  if (probability > total) {
    throw new Error("Probability cannot be higher than the total");
  }

  // - create the probability weights
  // - note that for the failure weight when we are subtracting
  //   the probability from total, we may end up with a large
  //   floating point number e.g. 1 - 0.81 = 0.18999999999999995
  //   to address this issue we use the length of probabilty to
  //   set the max digits after the decimal point
  // - we also need to parse this value again as a number, because
  //   toFixed() function returns a string

  const maxDecimals = probability.toString().length;
  const failureWeight = Number((total - probability).toFixed(maxDecimals));

  // - our actual probability weights
  const weights: Weights = {
    // - success ID
    T: probability,
    // - failure ID
    F: failureWeight,
  };

  // - use weighted-random function to pick a random result
  // - also shuffle 3 times to improve the randomness
  const result = wrand(weights, shuffle);

  // - check and return if the result ID is 'T', meaning the
  //   probability has been successful, otherwise false will
  //   will be returned.
  return result === "T";
}
