"use strict";

exports.__esModule = true;
exports.findConfigs = findConfigs;
exports.loadConfig = loadConfig;
exports.resolvePlugin = resolvePlugin;
exports.resolvePreset = resolvePreset;
exports.loadPlugin = loadPlugin;
exports.loadPreset = loadPreset;
exports.loadParser = loadParser;
exports.loadGenerator = loadGenerator;

function findConfigs(dirname) {
  return [];
}

function loadConfig(name, dirname) {
  throw new Error("Cannot load " + name + " relative to " + dirname + " in a browser");
}

function resolvePlugin(name, dirname) {
  return null;
}

function resolvePreset(name, dirname) {
  return null;
}

function loadPlugin(name, dirname) {
  throw new Error("Cannot load plugin " + name + " relative to " + dirname + " in a browser");
}

function loadPreset(name, dirname) {
  throw new Error("Cannot load preset " + name + " relative to " + dirname + " in a browser");
}

function loadParser(name, dirname) {
  throw new Error("Cannot load parser " + name + " relative to " + dirname + " in a browser");
}

function loadGenerator(name, dirname) {
  throw new Error("Cannot load generator " + name + " relative to " + dirname + " in a browser");
}