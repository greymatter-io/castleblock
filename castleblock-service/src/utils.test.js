import { describe, it, before, after } from "mocha";
import assert from "assert";
import child_process from "child_process";
import stream from "stream";
import fs from "fs";
import Path from "path";

import {
  getDirectories,
  versions,
  latestVersion,
  nextVersion,
  hash,
  createPath,
  writeStream,
  readStream,
  readManifest,
  injectBasePath,
} from "./utils.js";

before(() => {
  child_process.execSync(`
  mkdir -p /tmp/assets/my-app/1.0.0;
  mkdir -p /tmp/assets/my-app/1.0.1;
  mkdir -p /tmp/assets/my-app/2.0.1;
  mkdir -p /tmp/assets/my-app/3.1.0;
  mkdir -p /tmp/assets/my-app/3.2.1;
  `);
});

after(() => {
  child_process.execSync(`rm -rf /tmp/assets/`);
});
describe("utils.js", function () {
  describe("getDirectories", function () {
    it("should list directories", function () {
      // add an assertion
      assert.deepEqual(getDirectories("/tmp/assets/my-app"), [
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
      assert.deepEqual(versions("my-app", "/tmp/assets"), [
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
      assert.deepEqual(latestVersion("my-app", "/tmp/assets"), "3.2.1");
    });
  });

  describe("nextVersion", function () {
    it("should return the next patch version", function () {
      // add an assertion
      assert.deepEqual(nextVersion("1.0.0", "patch"), "1.0.1");
    });
    it("should return the next minor version", function () {
      // add an assertion
      assert.deepEqual(nextVersion("1.0.0", "minor"), "1.1.0");
    });
    it("should return the next major version", function () {
      // add an assertion
      assert.deepEqual(nextVersion("1.0.0", "major"), "2.0.0");
    });
  });

  describe("hash", () => {
    let s;
    before(() => {
      const Readable = stream.Readable;
      s = new Readable();
      s._read = () => {}; // redundant? see update below
      s.push("your text here");
      s.push(null);
    });
    it("should a hash of the stream", async () => {
      const r = await hash(s);
      assert.equal(
        r,
        "0d77fe0e5d8762fc4cb802c65ea65e4326bbe801e5f204c060afd8bde6c45c8dbd3f4b8ea48731af63f8073b4ee36f97f9de65e74da7503008304da42b8f460d"
      );
    });
  });

  describe("createPath", () => {
    it("should create a new directory", () => {
      createPath("/tmp/assets/my-app2");
      if (fs.existsSync("/tmp/assets/my-app2")) {
        assert.ok(true);
      } else {
        assert.ok(false);
      }
    });
  });

  describe("writeStream", () => {
    let s;
    before(() => {
      const Readable = stream.Readable;
      s = new Readable();
      s._read = () => {}; // redundant? see update below
      s.push("your text here");
      s.push(null);
    });
    it("should write the stream to a file", () => {
      writeStream(s, "/tmp/assets/test.txt");
      if (fs.existsSync("/tmp/assets/test.txt")) {
        assert.ok(true);
        fs.unlinkSync("/tmp/assets/test.txt");
      } else {
        assert.ok(false);
      }
    });
  });

  describe("readStream", () => {
    let s;
    before(() => {
      const Readable = stream.Readable;
      s = new Readable();
      s._read = () => {}; // redundant? see update below
      s.push("your text here");
      s.push(null);
    });
    it("should read the stream", async () => {
      const t = await readStream(s);
      assert.equal(t.toString("utf8"), "your text here");
    });
  });

  describe("readManifest", () => {
    before(() => {
      fs.writeFileSync(
        Path.join("/tmp/assets", "my-app", "3.2.1", `manifest.json`),
        `{ "test": "testing"}`
      );
    });
    it("should read manifest json file", () => {
      assert.deepEqual(readManifest("my-app"), { test: "testing" });
    });
  });

  describe("injectBasePath", () => {
    it("should modify the html by injecting a new base path", () => {
      const htmlExample = `<html><head></head><body></body></html>`;
      assert.equal(
        injectBasePath(htmlExample, "./test/"),
        `<html><head><base href="./test/" /></head><body></body></html>`
      );
    });
  });
});
