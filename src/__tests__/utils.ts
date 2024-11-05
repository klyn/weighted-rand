import { isObject } from "../utils";

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
