import { uuidv4 } from "../../src/util/uuid";

describe("uuidv4", () => {
  const UUIDV4_FORMAT_REGEX = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/;

  test("uuidv4 has the right format", () => {
    expect(uuidv4()).toMatch(UUIDV4_FORMAT_REGEX);
  });

  test("a new uuid is generated at each call", () => {
    expect(uuidv4()).not.toEqual(uuidv4());
  });
});
