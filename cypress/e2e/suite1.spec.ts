describe("Our first suite", () => {
  it("first test", () => {});

  it("second test", () => {});

  it("third test", () => {});
});

// We can have multiple "describe" blocks in one spec file
describe("Our second suite", () => {
  it("first test", () => {});

  it("second test", () => {});

  it("third test", () => {});

  // We can have nested "describe" blocks
  describe("Nested suite", () => {
    beforeEach("code before every test in the current describe block", () => {
      // So here we can have code, what we need to execute before every test in this block.
      // It can be f.e. the login or reading some data from localStorage, etc.
    });

    it("first nested test", () => {});

    it("second nested test", () => {});

    it("third nested test", () => {});
  });
});

// This is the same as "describe()"
// context()
