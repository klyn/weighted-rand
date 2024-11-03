import { wrand, Weights } from "../core";

const testData1: Weights = {
  a: 1,
};

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
  expect(typeof testData1[result as string]).toBe("number");
});