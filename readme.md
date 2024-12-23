# Weighted Pseudo-Random Functions

The `@klyn/weighted-rand` is a TypeScript package that provides a set of functions -- and soon classes, that aim to provide an easy way for picking a pseudo-random item from a set, where each item has a probability of being picked, relative to the other items in the set.

For example, imagine the follow set of weighted-probabilities:

```
// JavaScript
const weightedProb = {
  A: 2,
  B: 1,
  C: 1
};
```

The `weightedProb` set creates three possible outcomes where `A` is twice as likely to be picked compare to `B` and `C`, whilst `B` and `C` both have the same probability.

For detailed examples, see the **API** and **Examples** section below.

# How to use

The functions in this package can be used both in the browser and within the Node environment.

## Installation

**NPM**
`npm install @klyn/weighted-rand`

## Import

**Node.js**
`import { wrand, wbp } from  "@klyn/weighted-rand";`

# API

## Weights Data Type

This is the TypeScript data type that must be used for providing the list of weighted-probabilities to some functions.

```
// TypeScript, Node
import { Weights } from "@klyn/weighted-rand";

const weights: Weights = { A: 0.5, B: 0.8 };

// JavaScript
const weights = {A: 0.5, B: 0.8 };
```

The `key` of `Weights` should be a `string` and the weights value should be of type `number`.

## wrand Function

Weighted-random function returns a randomly chosen item from the provided list, according to the likelihood of each item being picked relative to other items in the list.

```
// TypeScript, Node
import { wrand, Weights } from "@klyn/weighted-rand";

// 50% chance of a, 50% chance of b
const weights: Weights = {a: 1, b: 1}
const results = wrand(weights);

// JavaScript, Node
import { wrand } from "@klyn/weighted-rand";

const weights = {a: 1, b: 1};
const results = wrand(weights);
```

**Options:**

- **Weights:** Required. This is the list of your weighted-probabilities as a data-object with keys of `string` data type and values of type `number`. In TypeScript use `Weights` data type. _Please note that the sum of all weights does **NOT** need to add up to 1 or 100. All weights and probabilities are relevant to other weights._
- **Shuffle:** The `wrand` function creates an array of probabilities internally -- called probability map, and then picks a random index and returns the value at that index. The shuffle argument indicates how many times this array should be shuffled before the value at the random index is resolved and returned. Default value for shuffle is 1. Setting this to 0 prevents shuffling the probability map. Shuffle should be a numerical value.
- **Return Internal Probability Map:** If this value is set to `true`, the `wrand` function returns its internal probability map, instead of choosing a random index and returning its value. This could be useful for debugging or making sure the function works as expected. This value is set to `false` by default.
- **Apply GCD Optimisation:** Since `wrand` allows floating-point numbers as probabilities e.g. `0.01`, it internally converts all of those numbers to their whole-number equivalent which results in a larger probability map. However, in some cases the size of the map could be reduced, if the _Greatest Common Divisor_ of all probabilities is a number higher than 1. In this case all probabilities could be divided by the GDC, thus, resulting in a smaller probability map. For example, the following weights `{ a: 0.3, b, 0.3, c: 1.2 }` first converts to `{ a: 3, b: 3, c: 12 }`. This means a probability map of `3 + 3 + 12`, however, using GCD optimisation, this can be lowered to the size of probability map getting reduced to `1 + 1 + 4` . This option is set to `true` by default.

## wbp Function

Weighted-boolean probability returns true or false based on the provided probability. This is similar to rolling a weighted dice and checking whether a specific value was the result of the roll or not.

The first argument is an arbitrary number, but in combination with the second argument they create the desired probability together. For example: 70 and 100 result in the probability of 70/100 or 70%. Meaning 70% possibility of `wbp` returning true.

```
// JavaScript
import { wbp } from "@klyn/weighted-rand";

wbp(40, 120); // 0.333..3% chance of returning true
```

**Options:**

- **Probability:** This `number` indicates the likelihood of `wbp` returning `true`, however, this value alone is not truly the probability of `wbp` as it requires the second argument to calculate the true desired probability.
- **Total Possibilities:** This is the `number` of total possibilities where the probability creates a likelihood.
- **Shuffle:** Since `wbp` internally makes use of `wrand` function, it also supports setting a custom value for shuffling the internal probability map of the `wrand` function. To understand this better, please have a look at the `wrand` function options. The shuffle value should be a `number`. The default value is set to 3 and setting it to 0 skips shuffling the probability map altogether.

# Examples

## Imports

```
import { wrand, wbp, Weights } from "@klyn/weighted-rand";
```

## Weighted Probabilities

```
// - Use Weights data type only for TypeScript
// - whole numbers, 50-50 chance
let weights: Weights = { a: 1, b: 1 };

// - floating-point weights
weights = { a: 0.01, b: 0.1, c: 1.23 };
```

## wrand Function Calls

```
// - using only weights with default options
wrand(weights);

// - shuffles 10 times
wrand(weights, 10);

// - no shuffles at all
wrand(weights, 0);

// - returns internal probability map
wrand(weights, 1, true);

// - returns map and skips GDC optimisation
wrand(weights, 1, true, false);

// - doesn't return the map, but disables GDC optimisation
wrand(weights, 1, false, false);
```

## wbp Function Calls

```
// - 81% chance of return true
wbp(81, 100);

// - 81% again
wbp(8.1, 10);

// - 81% again
wbp(0.81, 1);

// - ~25% chance, plus shuffles 7 times
wbp(23, 89, 7);
```
