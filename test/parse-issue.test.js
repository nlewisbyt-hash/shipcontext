import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseIssue } from "../src/lib/parse-issue.js";
import { adfToText } from "../src/lib/adf.js";
import { recommend } from "../src/lib/recommendation.js";

const description = {
  type: "doc",
  version: 1,
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "We decided to ship only after checkout tests are green.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Please also update the runbook." }],
    },
  ],
};

describe("adfToText", () => {
  it("joins paragraph text with newlines", () => {
    assert.equal(
      adfToText(description),
      "We decided to ship only after checkout tests are green.\nPlease also update the runbook."
    );
  });
});

describe("parseIssue", () => {
  it("extracts owners, open sub-tasks, and decision snippets", () => {
    const parsed = parseIssue({
      issue: {
        id: "10042",
        key: "SHIP-42",
        fields: {
          summary: "Release billing v2.4",
          status: { name: "In Review", statusCategory: { key: "indeterminate" } },
          issuetype: { name: "Story" },
          project: { key: "SHIP", name: "ShipContext Demo" },
          assignee: { displayName: "Priya Shah", accountId: "aaa" },
          reporter: { displayName: "Alex Chen", accountId: "bbb" },
          description,
          comment: {
            comments: [
              {
                author: { displayName: "Alex Chen" },
                body: {
                  type: "doc",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "Agreed that the feature flag stays at 10%.",
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          subtasks: [
            {
              key: "SHIP-55",
              fields: {
                summary: "Verify webhook retries",
                status: { name: "In Progress", statusCategory: { key: "indeterminate" } },
              },
            },
            {
              key: "SHIP-56",
              fields: {
                summary: "Write release notes",
                status: { name: "Done", statusCategory: { key: "done" } },
              },
            },
          ],
        },
      },
      remoteLinks: [
        {
          application: { type: "com.atlassian.confluence" },
          object: {
            title: "v2.4 go-live decision",
            url: "https://example.atlassian.net/wiki/spaces/SHIP/pages/1",
            summary: "Go live on 20 Nov only if checkout tests are green.",
          },
        },
        {
          application: { type: "com.github" },
          object: { title: "unrelated", url: "https://github.com/example" },
        },
      ],
      devSummary: {
        pullRequest: { overall: { count: 1, state: "OPEN" } },
        build: { overall: { state: "FAILED", count: 1 } },
      },
      errors: [],
    });

    assert.equal(parsed.key, "SHIP-42");
    assert.equal(parsed.assignee.displayName, "Priya Shah");
    assert.deepEqual(
      parsed.unresolvedSubtasks.map((item) => item.key),
      ["SHIP-55"]
    );
    assert.ok(
      parsed.decisions.some((item) => item.kind === "confluence" && /go-live/i.test(item.sourceLabel))
    );
    assert.ok(parsed.decisions.some((item) => /decided to ship/i.test(item.text)));
    assert.ok(parsed.decisions.some((item) => /feature flag/i.test(item.text)));
    assert.equal(parsed.devInfoVisible, true);
    assert.equal(parsed.failedChecks.length, 1);
    assert.equal(recommend(parsed).verdict, "WAIT");
  });

  it("records a visibility gap instead of inventing empty development data", () => {
    const parsed = parseIssue({
      issue: {
        id: "1",
        key: "SHIP-1",
        fields: {
          summary: "Test",
          status: { name: "To Do", statusCategory: { key: "new" } },
        },
      },
      remoteLinks: null,
      devSummary: null,
      errors: [
        {
          code: "permission",
          message: "Can't see linked pull requests and CI checks (permission denied).",
        },
      ],
    });
    assert.equal(parsed.devInfoVisible, false);
    assert.equal(parsed.pullRequests.length, 0);
    assert.ok(parsed.visibilityGaps[0].startsWith("Can't see"));
    const result = recommend(parsed);
    assert.equal(
      result.blockers.some((blocker) => blocker.kind === "pull-request"),
      false
    );
  });

  it("returns a visibility gap when the issue payload is missing", () => {
    const parsed = parseIssue({
      issue: null,
      errors: [{ message: "Can't see this issue (HTTP 404)." }],
    });
    assert.equal(parsed.key, null);
    assert.ok(parsed.visibilityGaps.length > 0);
  });
});
