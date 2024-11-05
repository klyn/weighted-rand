import { isObject, assertType } from "../utils";

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

// -- assertType
test("assertType should only accept strings for the second argument", () => {
  const result = () => assertType(123, Number as any);
  expect(result).toThrow(TypeError);
});

test("assertType should correctly throw an exception", () => {
  expect(() => assertType(123, "string")).toThrow(TypeError);
  expect(() => assertType("123", "number")).toThrow(TypeError);
  expect(() => assertType("123", "function")).toThrow(TypeError);
  expect(() => assertType("123", "object")).toThrow(TypeError);
});
