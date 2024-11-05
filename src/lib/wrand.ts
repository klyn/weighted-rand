// -- core functionality, types and utility functions
import { countDecimals } from "count-decimals";
import { gcd } from "mathjs";
import { shuffle as fastShuffle } from "fast-shuffle";
import { assertType, isObject } from "../utils";

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
 * @param {number} shuffle - Number of probability map shuufles,
 * defualt is 1
 * @param {boolean} mapOnly - Return the probability map instead of item,
 * false by default
 * @param {boolean} applyGCD - Apply GCD optimisation,
 * true by default
 * @returns {string|boolean|Array<string>} - A valid key from the weights
 * argument,a boolean value of false indicating errors or an array of strings
 * as the probability map
 */
export function wrand(
  weights: Weights,
  shuffle: number = 1,
  mapOnly: boolean = false,
  applyGCD: boolean = true
): string | boolean | Array<string> {
  // - only accept an Object as the weights argument
  if (!isObject(weights)) {
    return false;
  }

  // - get the list of IDs and weights from weights object
  const ids = Object.keys(weights);
  const weightValues = Object.values(weights);

  // - check if all IDs & weights have expected types
  ids.forEach((value) => assertType(value, "string"));
  weightValues.forEach((value) => assertType(value, "number"));

  // - if the weights object contains only one element,
  //   return the ID
  if (ids.length == 1) {
    return ids[0];
  }

  // - since we allow floating-point probabilities, we need
  //   to look for the highest number of digits after the
  //   decimal point in all of the probabilities. we'll use
  //   this number to convert all of the probabilities to whole
  //   numbers, keep their relative probability untouched.
  // - ideally we should use reduce, but TS shows some typing
  //   errors, thus, going to reduce it manually.
  let highestPrecision = 0;

  ids.forEach((id) => {
    // - number of digits after the decimal
    const precisionCount = countDecimals(weights[id]);
    // - check for undefined and then update the highest value
    //   if needed
    if (precisionCount && precisionCount > highestPrecision) {
      highestPrecision = precisionCount;
    }
  });

  // - in order to support floating-point weights, we need to
  //   multiply all weights by a common number in a way that
  //   it brings all floating-point numbers to a whole number,
  //   but also keeps the relevant weight the same, so the final
  //   results will be correct.
  // - example: [5.1, 5.01, 5] => [510, 501, 500]
  //
  // - to achieve this:
  // - a) we are going to create a new set of weights leaving the
  //      original values untouched.
  // - b) next, we are going to loop through the original weights,
  //      whilst filling-up the new weights data.
  // - c) we first need to bring 10 to the power of the highest
  //      precision value that we calculated previously. This gives
  //      the common number that we can multiply every weight with it.
  //      here we us the ** exponentiation operator rather than the
  //      Math.pow() function because it supports BigInts values,
  //      however, it is hard to imagine this will ever be needed.
  // - d) we then need to multiply the actual original weight value
  //      by the common multiplier number.
  // - e) we then need to use the toFixed() function without any
  //      arguments, because of floating-point calculation issues:
  //      for example: 5.1 * 10 ** 2 results in 509.99999999999994
  // - f) in the end we need to parse this value again as a number
  //      because toFixed() function returns a string.
  // - g) meanwhile, we also add up these numbers to find the total.
  //      this is needed in the next step when we are creating a map.

  // - new weights & probability data
  const updatedWeights: Weights = {};
  // - sum of all weights
  let weightsTotal = 0;
  // - looping through the origianl weights
  ids.forEach((id) => {
    // - multiplying all weights by a common multiplier
    const newWeight = Number((weights[id] * 10 ** highestPrecision).toFixed());
    // update the data set
    updatedWeights[id] = newWeight;
    // update the totals
    weightsTotal += newWeight;
  });

  // - now with weights multiplied by a common multiplier,
  //   we have potentially much larger numbers which could
  //   result in a large probability map.
  // - an optimisation step we can take here is to find the
  //   the greatest common divisor -- or GCD, of all weights
  //   and if it is higher than 1, divide each weight by the
  //   GCD value.
  // - for example, in the previous step we went from:
  //   [0.03, 0.03, 1.2] to [3, 3, 120] which means the size
  //   of our probability map will be 126. However, by finding
  //   the GCD of all elements and dividing all weights by it,
  //   we will get a much smaller map:
  //   GCD: 3; Weights: [1, 1, 40]: Map Size: 42

  // - Apply GCD optimisation, true by default
  if (applyGCD) {
    // - spreading the weights...
    const weightsGCD: number = gcd(...Object.values(updatedWeights));
    // - checking for undefined
    // - GCD greater than 1
    // - and GCD being a whole number, otherwise we will get
    //   decimal points in the weights again
    if (weightsGCD && weightsGCD > 1 && weightsGCD % 1 === 0) {
      // - the sum of weights needs reseting and updating now
      weightsTotal = 0;
      // - looping through the weights by their IDs
      ids.forEach((id) => {
        // - using a division assignment, as it works just fine
        updatedWeights[id] /= weightsGCD;
        // - as well as addition assignment for updating the totals
        weightsTotal += updatedWeights[id];
      });
    }
  }

  // - in order to create the probability map, we need to:
  // - a) loop throught the weights via their IDs
  // - b) store the weight in a variable where it can be modified
  // - c) start a loop and keep pushing the current ID to the map
  //      and reducing the weight value, until it reaches zero.
  // - for example, the following weights:
  //   {a: 2, b: 1, c: 1}
  //   results in the following probability map:
  //   [a, a, b, c]

  // - probability map variable, we may reassign this
  //   variable when performing a shuffle
  let probMap: Array<string> = [];
  // - looping through weights by their IDs
  ids.forEach((id) => {
    // - store the weight value somewhere we can change
    let weight = updatedWeights[id];
    // - loop until weight has reached 0
    while (weight > 0) {
      // - push the current ID into the probability map
      probMap.push(id);
      // - reduce the weight
      weight--;
    }
  });

  // - shuffling the probability map could help with
  //   picking a better random value
  // - the argument value could be 0 or higher. if the
  //   value is set to 0, the following block will get
  //   skipped by default.

  // - loop for the number of shuffles, passed via arguments
  for (let s = 0; s < shuffle; s++) {
    // - shuffle and reassign to the probability map variable
    probMap = fastShuffle(probMap);
  }

  // - in some case we may only be interested in getting the
  //   produced probability map
  // - if mapOnly is set to true, then return early here
  if (mapOnly) {
    return probMap;
  }

  // - time to pick a pseudo-random element from the probability map
  // - in order to pick a random valid index, we use min/max values
  // - min is set to 0
  // - max is set to the length of our probability map array, minus 1
  const randMin = 0;
  const randMax = probMap.length - 1;
  const randIndex = Math.floor(
    Math.random() * (randMax - randMin + 1) + randMin
  );
  // - our randomly chosen item from the probability map
  // - this item represents an ID from our original weights
  //   object, passed via function arguments
  const randProbability: string = probMap[randIndex];

  // - check to make sure our randIndex is indeed valie
  if (randProbability) {
    return randProbability;
  }

  // - return false here to indicate something has gone wrong
  return false;
}
