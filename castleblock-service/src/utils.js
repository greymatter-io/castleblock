"use strict";
import fs from "fs";
import _ from "lodash";
import semver from "semver";
import semverGt from "semver/functions/gt";
import semverSort from "semver/functions/sort";
import semverMajor from "semver/functions/major";
import semverMinor from "semver/functions/minor";
import semverPatch from "semver/functions/patch";
import semverInc from "semver/functions/inc";
import crypto from "crypto";
import tarStream from "tar-stream";

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
  console.log("currentVesion", version);
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
  return new Promise((resolve, reject) => {
    const hasher = crypto.createHash("sha512");
    hasher.setEncoding("hex");
    stream.pipe(hasher).on("finish", function () {
      resolve(hasher.read());
    });
  });
}

export function setEnv(envVar, defaultValue, format) {
  if (typeof envVar === "undefined") {
    return defaultValue;
  } else {
    if (format === "json") {
      return JSON.parse(envVar);
    }
    return envVar;
  }
}
export function createPath(p, clearExisting) {
  if (clearExisting) {
    fs.rmdirSync(p, { recursive: true });
  }
  fs.mkdirSync(p, { recursive: true });
  return p;
}
export async function writeStream(stream, filePath) {
  return new Promise((resolve, reject) => {
    console.log("test", filePath);
    const s = stream.pipe(fs.createWriteStream(filePath));
    s.on("finish", function () {
      console.log("finished writing", filePath);
      resolve();
    });
  });
}
export function readStream(stream) {
  let data;
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      console.log(`Received ${chunk.length} bytes of data.`);
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
export async function getManifest(oldTarballStream) {
  let extract = tarStream.extract();
  let manifest;
  await new Promise((resolve, reject) => {
    extract.on("entry", async function (header, stream, callback) {
      // write the new entry to the pack stream
      if (header.name == "manifest.json") {
        manifest = JSON.parse(await readStream(stream));
        resolve();
      }
      callback();
    });

    oldTarballStream.pipe(extract);
  });
  return manifest;
}
export function injectBasePath(htmlString, relPath) {
  return `${htmlString}`.replace("<head>", `<head><base href="${relPath}" />`);
}
export default {
  setEnv,
  getDirectories,
  latestVersion,
  nextVersion,
  versions,
  hash,
  createPath,
  readStream,
  writeStream,
  getManifest,
  injectBasePath,
};
