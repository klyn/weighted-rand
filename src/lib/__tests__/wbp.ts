import { wbp } from "../wbp";

test("wbp should return a boolean value", () => {
  expect(typeof wbp(10, 100)).toBe("boolean");
});

test("wbp should return true when probability and total are the same", () => {
  expect(wbp(1, 1)).toEqual(true);
});

test("wbp should throw Error for non-numerical values", () => {
  const resultProb = () => wbp("1" as any, 1); // probability
  const resultTotal = () => wbp(1, undefined as any); // total
  const resultShuffle = () => wbp(1, 2, "3" as any); // shuffle
  expect(resultProb).toThrow(TypeError);
  expect(resultTotal).toThrow(TypeError);
  expect(resultShuffle).toThrow(TypeError);
});

test("wbp should throw Error when probability is higher than total", () => {
  const result = () => wbp(2, 1);
  expect(result).toThrow(Error);
});

test("wbp should return boolean values for valid inputs", () => {
  expect(typeof wbp(1, 2)).toBe("boolean");
  expect(typeof wbp(0.81, 1)).toBe("boolean");
  expect(typeof wbp(0.00081, 1)).toBe("boolean");
  expect(typeof wbp(50, 100)).toBe("boolean");
  expect(typeof wbp(71, 89)).toBe("boolean");
});
