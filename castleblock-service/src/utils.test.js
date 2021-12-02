import { describe, it, before, after } from "mocha";
import assert from "assert";
import child_process from "child_process";

import { getDirectories, versions, latestVersion } from "./utils";

before(() => {
  child_process.execSync(`
  mkdir -p /tmp/tests/deployments/my-app/1.0.0;
  mkdir -p /tmp/tests/deployments/my-app/1.0.1;
  mkdir -p /tmp/tests/deployments/my-app/2.0.1;
  mkdir -p /tmp/tests/deployments/my-app/3.1.0;
  mkdir -p /tmp/tests/deployments/my-app/3.2.1;
  `);
});

after(() => {
  child_process.execSync(`rm -rf /tmp/tests/`);
});
describe("utils.js", function () {
  describe("getDirectories", function () {
    it("should list directories", function () {
      // add an assertion
      assert.deepEqual(getDirectories("/tmp/tests/deployments/my-app"), [
        "1.0.0",
        "1.0.1",
        "2.0.1",
        "3.1.0",
        "3.2.1",
      ]);
    });
  });

  describe("versions", function () {
    it("should return an array", function () {
      // add an assertion
      //
      //
      assert.deepEqual(versions("my-app", "/tmp/tests/deployments"), [
        "1.0.0",
        "1.0.1",
        "2.0.1",
        "3.1.0",
        "3.2.1",
      ]);
    });
  });

  describe("latestVersion", function () {
    it("should return the latest version", function () {
      // add an assertion
      assert.deepEqual(
        latestVersion("my-app", "/tmp/tests/deployments/"),
        "3.2.1"
      );
    });
  });
});
