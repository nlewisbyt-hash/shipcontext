import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { recommend, toViewModel } from "../src/lib/recommendation.js";
import { getDemoParsedIssue } from "../src/lib/demo-data.js";
import { formatViewModel } from "../src/lib/format.js";

const base = {
  id: "1",
  key: "SHIP-1",
  summary: "Ready release",
  status: "In Review",
  statusCategory: "indeterminate",
  issueType: "Story",
  projectKey: "SHIP",
  projectName: "Ship",
  assignee: { displayName: "Priya Shah", accountId: "abc" },
  reporter: { displayName: "Alex Chen", accountId: "def" },
  unresolvedSubtasks: [],
  decisions: [],
  pullRequests: [{ name: "PR #1", status: "OPEN", url: null }],
  failedChecks: [],
  devInfoVisible: true,
  visibilityGaps: [],
};

describe("recommend", () => {
  it("returns SHIP when no blockers are visible", () => {
    const result = recommend(base);
    assert.equal(result.verdict, "SHIP");
    assert.equal(result.blockers.length, 0);
    assert.match(result.nextStep, /review|merge|deploy/i);
  });

  it("returns WAIT when a CI check failed", () => {
    const result = recommend({
      ...base,
      failedChecks: [{ name: "CI on PR #184", status: "FAILED" }],
    });
    assert.equal(result.verdict, "WAIT");
    assert.equal(result.blockers[0].kind, "check");
    assert.match(result.nextStep, /failing check/i);
  });

  it("returns WAIT when a sub-task is still open", () => {
    const result = recommend({
      ...base,
      unresolvedSubtasks: [{ key: "SHIP-55", summary: "Verify webhook retries" }],
    });
    assert.equal(result.verdict, "WAIT");
    assert.equal(result.blockers[0].kind, "subtask");
    assert.match(result.blockers[0].text, /SHIP-55/);
  });

  it("returns WAIT when the issue is unassigned and not Done", () => {
    const result = recommend({ ...base, assignee: null });
    assert.equal(result.verdict, "WAIT");
    assert.equal(result.blockers[0].kind, "owner");
  });

  it("returns WAIT when dev info is visible and no pull request is linked", () => {
    const result = recommend({
      ...base,
      pullRequests: [],
      devInfoVisible: true,
    });
    assert.equal(result.verdict, "WAIT");
    assert.equal(result.blockers[0].kind, "pull-request");
  });

  it("does not treat missing dev info as a missing pull request", () => {
    const result = recommend({
      ...base,
      pullRequests: [],
      failedChecks: [],
      devInfoVisible: false,
      visibilityGaps: [],
    });
    assert.equal(result.verdict, "SHIP");
    assert.ok(
      result.visibilityGaps.some((gap) => /Can't see linked pull requests/i.test(gap))
    );
    assert.equal(
      result.blockers.some((blocker) => blocker.kind === "pull-request"),
      false
    );
  });

  it("returns SHIP for a Done issue with no blockers, even without a PR", () => {
    const result = recommend({
      ...base,
      status: "Done",
      statusCategory: "done",
      pullRequests: [],
      devInfoVisible: true,
    });
    assert.equal(result.verdict, "SHIP");
    assert.match(result.reason, /Done/);
  });

  it("applies the same rules to the canned demo issue (WAIT)", () => {
    const parsed = getDemoParsedIssue();
    const result = recommend(parsed);
    assert.equal(result.verdict, "WAIT");
    assert.ok(result.blockers.some((blocker) => blocker.kind === "subtask"));
    assert.ok(result.blockers.some((blocker) => blocker.kind === "check"));
    const text = formatViewModel(toViewModel(parsed, result, "demo"));
    assert.match(text, /SHIP-42/);
    assert.match(text, /Recommendation: WAIT/);
    assert.match(text, /webhook retries/);
  });
});
