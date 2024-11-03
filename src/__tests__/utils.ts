import { countDecimalPlaces, isObject } from "../utils";

const mixedTypeArray: Array<any> = [
  null,
  undefined,
  () => false,
  true,
  { x: "y" },
  [],
];

const intArray1: Array<number> = [0, 1, 9, 37, 999, 10101, -1];

const flaotArray1: Array<number> = [0.1, 1.0, 1.1, 1.23, 1.23e4, 1.23e-4];

// [number, count of decimal places]
const validDecPlaces1: Array<number[]> = [
  [1, 0],
  [1.0, 0],
  [1.1, 1],
  [100.01, 2],
  [1.234, 3],
  [1.2345, 4],
  [1.23e4, 0],
  [1.23e-4, 6],
];

// -- countDecimalPlaces
test("countDecimalPlaces(x) should return undefined for anything that is not a number", () => {
  mixedTypeArray.forEach((x) =>
    expect(countDecimalPlaces(x as any)).toEqual(undefined)
  );
});

test("countDecimalPlaces(x) should return 0 for whole numbers", () => {
  intArray1.forEach((x) => expect(countDecimalPlaces(x)).toEqual(0));
});

test("countDecimalPlaces(x) should return integer", () => {
  flaotArray1.forEach((x) => {
    const result = Number.isInteger(countDecimalPlaces(x));
    expect(result).toEqual(true);
  });
});

test("countDecimalPlaces(x) should return correct count of decimal places", () => {
  validDecPlaces1.forEach((x) =>
    expect(countDecimalPlaces(x[0])).toEqual(x[1])
  );
});

// -- isObject
test("isObject(x) should only return true for data objects", () => {
  // fail cases
  expect(isObject(undefined)).toBe(false); // undefined
  expect(isObject(null)).toBe(false); // null
  expect(isObject(123)).toBe(false); // number
  expect(isObject("123")).toBe(false); // string
  expect(isObject(true)).toBe(false); // boolean
  expect(isObject(() => {})).toBe(false); // function
  expect(isObject([])).toBe(false); // array
  expect(isObject(class x {})).toBe(false); // class
  // success cases
  expect(isObject({})).toBe(true); // object
});
