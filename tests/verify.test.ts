import {
  verifyUsername,
  verifyEmail,
  verifyPassword,
} from "../src/core/verifyArray/verify";

import { describe, expect, test } from "@jest/globals";

describe("Verify Username module", () => {
  test("checks test case #1 passed", () => {
    expect(verifyUsername("dhruv     (!&#4")).toBe(false);
  });
  test("checks test case #2 passed", () => {
    expect(verifyUsername("d Rayat")).toBe(false);
  });
  test("checks test case #3 passed", () => {
    expect(verifyUsername("DHRUVrAYT ")).toBe(false);
  });
  test("checks test case #4 passed", () => {
    expect(verifyUsername("123*")).toBe(false);
  });
  test("checks test case #5 passed", () => {
    expect(verifyUsername("12378")).toBe(true);
  });
  test("checks test case #6 passed", () => {
    expect(verifyUsername(" ")).toBe(false);
  });
  test("checks test case #7 passed", () => {
    expect(verifyUsername("dhruvRayat1")).toBe(true);
  });
  test("checks test case #8 passed", () => {
    expect(verifyUsername("dhruv")).toBe(true);
  });
  test("checks test case #9 passed", () => {
    expect(verifyUsername("rayat1")).toBe(true);
  });
});

describe("Verify email module", () => {
  test("checks test case #1 passed", () => {
    expect(verifyEmail("dhruv@gmail.com")).toBe(true);
  });
  test("checks test case #2 passed", () => {
    expect(verifyEmail("dhruvgmail.com")).toBe(false);
  });
  test("checks test case #3 passed", () => {
    expect(verifyEmail("gmail@dhruv.dhruv")).toBe(true);
  });
  test("checks test case #4 passed", () => {
    expect(verifyEmail("123khskf  sakjhdfk sdf")).toBe(false);
  });
  test("checks test case #5 passed", () => {
    expect(verifyEmail("   dhruv@dhuv.com")).toBe(false);
  });
  test("checks test case #6 passed", () => {
    expect(verifyEmail(" ")).toBe(false);
  });
  test("checks test case #7 passed", () => {
    expect(verifyEmail("dhruvRayat1")).toBe(false);
  });
  test("checks test case #8 passed", () => {
    expect(verifyEmail("dhruv")).toBe(false);
  });
  test("checks test case #9 passed", () => {
    expect(verifyEmail("dhruv@dhruvrayat.com")).toBe(true);
  });
});

describe("Verify password module", () => {
  test("checks test case #1 passed", () => {
    expect(verifyPassword("Password")).toBe(false);
  });
  test("checks test case #2 passed", () => {
    expect(verifyPassword("password123")).toBe(false);
  });
  test("checks test case #3 passed", () => {
    expect(verifyPassword("!@##paASWorD123")).toBe(true);
  });
  test("checks test case #4 passed", () => {
    expect(verifyPassword(" PassWOrD")).toBe(false);
  });
  test("checks test case #5 passed", () => {
    expect(verifyPassword("   dhruv@dhuv.com")).toBe(false);
  });
  test("checks test case #6 passed", () => {
    expect(verifyPassword(" ")).toBe(false);
  });
  test("checks test case #7 passed", () => {
    expect(verifyPassword("dhruvRayat1")).toBe(false);
  });
  test("checks test case #8 passed", () => {
    expect(verifyPassword("Password1@")).toBe(true);
  });
  test("checks test case #9 passed", () => {
    expect(verifyPassword("dhruv@dhruvrayat.com")).toBe(false);
  });
});
