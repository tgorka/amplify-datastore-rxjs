// package-github-modification.js
//import { writeFileSync, readFileSync } from "fs";
const { writeFileSync, readFileSync } = require("fs");

const file = readFileSync("./package.json", {
  encoding: "utf-8",
});

const json = JSON.parse(file);

json.name = `${process.env.SCOPE}/${json.name}`;
json.publishConfig.registry = process.env.REGISTRY;

writeFileSync("./package.json", JSON.stringify(json, undefined, 2));