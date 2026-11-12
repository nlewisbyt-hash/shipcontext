/**
 * Fictional demo issue used when live Jira data is unavailable, and as the
 * scripted walkthrough for judges. This is not a real project or customer data.
 */

export const DEMO_ISSUE_KEY = "SHIP-42";

export const demoContext = Object.freeze({
  source: "demo",
  issue: {
    id: "10042",
    key: DEMO_ISSUE_KEY,
    summary: "Release billing v2.4 to production",
    status: "In Review",
    statusCategory: "indeterminate",
    issueType: "Story",
    projectKey: "SHIP",
    projectName: "ShipContext Demo",
  },
  owners: {
    assignee: { displayName: "Priya Shah", accountId: null },
    reporter: { displayName: "Alex Chen", accountId: null },
  },
  decisions: [
    {
      text: "Go live on 20 Nov only if checkout regression tests are green.",
      sourceLabel: "Confluence: v2.4 go-live decision",
      url: "https://example.com/wiki/v2-4-go-live-decision",
      kind: "confluence",
    },
    {
      text: "Feature flag billing-v2 remains off for 10% of traffic until 24 hours after deploy.",
      sourceLabel: "Comment by Alex Chen",
      url: null,
      kind: "comment",
    },
  ],
  blockers: [
    {
      id: "subtask-open",
      kind: "subtask",
      text: "SHIP-55 Verify webhook retries is still unresolved",
      url: null,
    },
    {
      id: "check-failed",
      kind: "check",
      text: "CI checks failed on pull request #184 (billing-v2-release)",
      url: null,
    },
  ],
  pullRequests: [
    {
      name: "PR #184 billing-v2-release",
      status: "OPEN",
      url: null,
    },
  ],
  visibilityGaps: [],
  recommendation: null,
});

/**
 * Parsed-issue shape that the recommendation engine consumes. Kept in sync
 * with parse-issue.js so the demo path uses the same rules as live data.
 */
export function getDemoParsedIssue() {
  return {
    id: "10042",
    key: DEMO_ISSUE_KEY,
    summary: "Release billing v2.4 to production",
    status: "In Review",
    statusCategory: "indeterminate",
    issueType: "Story",
    projectKey: "SHIP",
    projectName: "ShipContext Demo",
    assignee: { displayName: "Priya Shah", accountId: null },
    reporter: { displayName: "Alex Chen", accountId: null },
    unresolvedSubtasks: [
      {
        key: "SHIP-55",
        summary: "Verify webhook retries",
      },
    ],
    decisions: demoContext.decisions.map((d) => ({ ...d })),
    pullRequests: demoContext.pullRequests.map((p) => ({ ...p })),
    failedChecks: [
      {
        name: "CI checks on pull request #184 (billing-v2-release)",
        status: "FAILED",
      },
    ],
    devInfoVisible: true,
    visibilityGaps: [],
  };
}
