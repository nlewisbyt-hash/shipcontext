#!/usr/bin/env node
/**
 * Prints the ShipContext panel as plain text from the canned demo issue,
 * or from a JSON file of parsed-issue / raw Jira payloads.
 *
 * Usage:
 *   npm run preview
 *   node scripts/preview-context.js path/to/parsed-issue.json
 */
import { readFile } from "node:fs/promises";
import { getDemoParsedIssue } from "../src/lib/demo-data.js";
import { parseIssue } from "../src/lib/parse-issue.js";
import { recommend, toViewModel } from "../src/lib/recommendation.js";
import { formatViewModel } from "../src/lib/format.js";

const inputPath = process.argv[2];
let parsed;
let source = "demo";

if (inputPath) {
  const raw = JSON.parse(await readFile(inputPath, "utf8"));
  parsed = raw.fields || raw.issue ? parseIssue(raw) : raw;
  source = "file";
} else {
  parsed = getDemoParsedIssue();
}

const view = toViewModel(parsed, recommend(parsed), source);
process.stdout.write(`${formatViewModel(view)}\n`);
