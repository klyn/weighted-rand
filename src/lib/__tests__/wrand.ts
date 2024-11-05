import { wrand, Weights } from "../wrand";

const testData1: Weights = {
  a: 1,
};

const testData2: Weights = {
  A: 2,
  B: 1,
  C: 1,
};

const testData3: Weights = {
  A: 3,
  B: 3,
  C: 3,
};

const testData2Map: Array<string> = ["A", "A", "B", "C"];
const testData3Map: Array<string> = ["A", "B", "C"];
const testData3MapNonGCD: Array<string> = [
  "A",
  "A",
  "A",
  "B",
  "B",
  "B",
  "C",
  "C",
  "C",
];

const nonObjectArray: Array<any> = [123, [], () => {}, null];

test("wrand should be a function", () => {
  expect(wrand).toBeInstanceOf(Function);
});

test("wrand should return a string", () => {
  expect(typeof wrand(testData1)).toBe("string");
});

test("wrand(x) should return false, if x is not an object", () => {
  nonObjectArray.forEach((x) => expect(wrand(x as any)).toEqual(false));
});

test("if argument to wrand has only one pair, wrand should return it", () => {
  const result = wrand(testData1);
  expect(typeof testData1[result as string]).not.toEqual(undefined);
});

test("wrand should return a valid ID from the list of weights", () => {
  const result = wrand(testData2);
  expect(typeof testData2[result as string]).not.toEqual(undefined);
});

test("wrand should return the probability map when requested", () => {
  // setting shuffle to 0, otherwise arrays won't be equal
  // which means we are testing the shuffle flag too
  const result = wrand(testData2, 0, true);
  expect(result).toEqual(testData2Map);
});

test("wrand should skip GCD when requested", () => {
  const resultWithGCD = wrand(testData3, 0, true); // GCD is on by default
  const resultWithoutGCD = wrand(testData3, 0, true, false); // GCD off
  expect(resultWithGCD).toEqual(testData3Map);
  expect(resultWithoutGCD).toEqual(testData3MapNonGCD);
});

test("wrand shuffles the map at least once when requested", () => {
  const result = wrand(testData2, 1, true) as Array<string>;
  // should not be equal, because it is shuffled
  expect(result).not.toEqual(testData2Map);
  // sort and then check equality to make sure it was indeed
  // the expected map
  expect(result.sort()).toEqual(testData2Map);
});
