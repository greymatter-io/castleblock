import fs from "fs";
import _ from "lodash";
import semver from "semver";
import semverGt from "semver/functions/gt";
import semverSort from "semver/functions/sort";
import semverMajor from "semver/functions/major";
import semverMinor from "semver/functions/minor";
import semverPatch from "semver/functions/patch";
import semverInc from "semver/functions/inc";

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
