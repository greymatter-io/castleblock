"use strict";
import fs from "fs";
import Path from "path";
import _ from "lodash";
import semver from "semver";
import semverSort from "semver/functions/sort.js";
import semverMajor from "semver/functions/major.js";
import semverMinor from "semver/functions/minor.js";
import semverPatch from "semver/functions/patch.js";
import crypto from "crypto";
import tarStream from "tar-stream";

import settings from "./settings.js";

export function getDirectories(source) {
  if (!fs.existsSync(source)) {
    return [];
  }
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => {
      return dirent.isDirectory();
    })
    .map((dirent) => dirent.name);
}

export function versions(appName, path) {
  const v = semverSort(
    getDirectories(`${path}/${appName}`).filter((n) => semver.valid(n))
  );
  return v ? v : [];
}

export function latestVersion(appName, path) {
  const v = _.last(
    semverSort(
      getDirectories(`${path}/${appName}`).filter((n) => semver.valid(n))
    )
  );
  return v ? v : "0.0.0";
}

export function nextVersion(version, action) {
  console.debug("currentVesion", version);
  let patch = semverPatch(version);
  let minor = semverMinor(version);
  let major = semverMajor(version);
  if (version) {
    if (semver.valid(action)) {
      //If the action is a valid semver version
      return action;
    }
    if (action == "patch") {
      return `${major}.${minor}.${patch + 1}`;
    }
    if (action == "minor") {
      return `${major}.${minor + 1}.${patch}`;
    }
    if (action == "major") {
      return `${major + 1}.${minor}.${patch}`;
    }
    if (action == "current") {
      return `${major}.${minor}.${patch}`;
    }
  }
  return `${major}.${minor}.${patch + 1}`;
}

export function hash(stream) {
  return new Promise((resolve) => {
    const hasher = crypto.createHash("sha512");
    hasher.setEncoding("hex");
    stream.pipe(hasher).on("finish", function () {
      resolve(hasher.read());
    });
  });
}

export function createPath(p, clearExisting) {
  if (clearExisting) {
    fs.rmdirSync(p, { recursive: true });
  }
  fs.mkdirSync(p, { recursive: true });
  return p;
}
export async function writeStream(stream, filePath) {
  return new Promise((resolve) => {
    const s = stream.pipe(fs.createWriteStream(filePath));
    s.on("finish", function () {
      console.debug("finished writing", filePath);
      resolve();
    });
  });
}
export function readStream(stream) {
  let data;
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      console.debug(`Received ${chunk.length} bytes of data.`);
      data = data ? data + chunk : chunk;
    });
    stream.on("end", () => {
      resolve(data);
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
}
export async function extractManifest(oldTarballStream) {
  let extract = tarStream.extract();
  let manifest;
  await new Promise((resolve, reject) => {
    console.debug("get man");
    extract.on("entry", async function (header, stream, next) {
      // write the new entry to the pack stream
      console.debug(header.name);
      if (header.name == "manifest.json") {
        manifest = JSON.parse(await readStream(stream));
        resolve();
      }
      stream.on("end", function () {
        next(); // ready for next entry
      });

      stream.resume(); // just auto drain the stream
    });
    extract.on("finish", function () {
      reject(
        new Error(
          "manifest.json not found. Please include a manifest.json in your dist directory."
        )
      );
    });
    oldTarballStream.pipe(extract);
  });
  return manifest;
}
export function readManifest(appName) {
  return JSON.parse(
    fs.readFileSync(
      Path.join(
        `${settings.assetPath}`,
        `${appName}`,
        `${latestVersion(appName, settings.assetPath)}`,
        "manifest.json"
      )
    )
  );
}
export function injectBasePath(htmlString, relPath) {
  return `${htmlString}`.replace("<head>", `<head><base href="${relPath}" />`);
}
export default {
  getDirectories,
  latestVersion,
  nextVersion,
  versions,
  hash,
  createPath,
  readStream,
  writeStream,
  extractManifest,
  readManifest,
  injectBasePath,
};
