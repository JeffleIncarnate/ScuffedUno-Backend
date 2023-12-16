import { verifyArray } from "../src/core/verifyArray/verifyArray";
import { describe, expect, test } from "@jest/globals";

// TEST CASE #1
const testCase1 = {
  username: "DhruvRayat",
  email: undefined,
  password: undefined,
};

const testCase1Answer = {
  succeded: false,
  itemsMissing: ["email", "password"],
};

// TEST CASE #2
const testCase2 = {
  username: "DhruvRayat",
  email: "dhruvrayat@gmail.com",
  password: undefined,
};

const testCase2Answer = {
  succeded: false,
  itemsMissing: ["password"],
};

// TEST CASE #3
const testCase3 = {
  username: "DhruvRayat",
  email: undefined,
  password: "supersecurepassword",
};

const testCase3Answer = {
  succeded: false,
  itemsMissing: ["email"],
};

// TEST CASE #4
const testCase4 = {
  username: "DhruvRayat",
  email: "dhruvrayat@gmail.com",
  password: "supersecurepassword",
};

const testCase4Answer = {
  succeded: true,
  itemsMissing: [],
};

describe("verifyArray module", () => {
  test("checks test case #1 passed", () => {
    expect(verifyArray(testCase1)).toStrictEqual(testCase1Answer);
  });
  test("checks test case #2 passed", () => {
    expect(verifyArray(testCase2)).toStrictEqual(testCase2Answer);
  });
  test("checks test case #3 passed", () => {
    expect(verifyArray(testCase3)).toStrictEqual(testCase3Answer);
  });
  test("checks test case #4 passed", () => {
    expect(verifyArray(testCase4)).toStrictEqual(testCase4Answer);
  });
});
