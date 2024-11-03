import { testFn, result } from "../index";

test("testFn() should return okay", () => {
  expect(testFn()).toBe(result);
});
