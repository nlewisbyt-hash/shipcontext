import { adfToText } from "./adf.js";

const DECISION_PATTERN =
  /\b(decid(?:e|ed|es|ing)|decision|go-live|go live|we will ship|agreed to|agreed that)\b/i;

/**
 * Turn raw Jira REST payloads into the shape `recommend()` expects.
 * Missing or unauthorized resources must be listed in `visibilityGaps`
 * rather than treated as empty.
 */
export function parseIssue({ issue, remoteLinks, devSummary, errors = [] }) {
  const fields = issue?.fields || {};
  const visibilityGaps = (errors || [])
    .map((error) => error.message)
    .filter(Boolean);

  if (!issue) {
    return {
      id: null,
      key: null,
      summary: null,
      status: null,
      statusCategory: null,
      issueType: null,
      projectKey: null,
      projectName: null,
      assignee: null,
      reporter: null,
      unresolvedSubtasks: [],
      decisions: [],
      pullRequests: [],
      failedChecks: [],
      devInfoVisible: false,
      visibilityGaps:
        visibilityGaps.length > 0
          ? visibilityGaps
          : ["Can't see this issue (no payload was returned)."],
    };
  }

  const comments = asArray(fields.comment?.comments || fields.comment);
  const decisions = [
    ...decisionsFromConfluenceLinks(asArray(remoteLinks)),
    ...decisionsFromText(
      "Description",
      adfToText(fields.description),
      null,
      "description"
    ),
    ...comments.flatMap((comment) =>
      decisionsFromText(
        `Comment by ${person(comment.author)?.displayName || "unknown"}`,
        comment.body ? adfToText(comment.body) : String(comment.body || ""),
        null,
        "comment"
      )
    ),
  ];

  const unresolvedSubtasks = asArray(fields.subtasks)
    .filter((subtask) => {
      const category = subtask?.fields?.status?.statusCategory?.key;
      const name = subtask?.fields?.status?.name;
      if (category) {
        return category !== "done";
      }
      return !/done|closed|resolved|cancelled|canceled/i.test(name || "");
    })
    .map((subtask) => ({
      key: subtask.key,
      summary: subtask.fields?.summary || "Untitled sub-task",
      url: null,
    }));

  const dev = parseDevSummary(devSummary, visibilityGaps);

  return {
    id: issue.id,
    key: issue.key,
    summary: fields.summary || "",
    status: fields.status?.name || "Unknown",
    statusCategory: fields.status?.statusCategory?.key || null,
    issueType: fields.issuetype?.name || null,
    projectKey: fields.project?.key || null,
    projectName: fields.project?.name || null,
    assignee: person(fields.assignee),
    reporter: person(fields.reporter),
    unresolvedSubtasks,
    decisions,
    pullRequests: dev.pullRequests,
    failedChecks: dev.failedChecks,
    devInfoVisible: dev.visible,
    visibilityGaps,
  };
}

function parseDevSummary(devSummary, visibilityGaps) {
  if (!devSummary) {
    return { visible: false, pullRequests: [], failedChecks: [] };
  }

  const pullRequests = [];
  const failedChecks = [];

  const prOverall = devSummary.pullRequest?.overall || devSummary.pullRequests?.overall;
  const prCount = numberOrZero(prOverall?.count);
  if (prCount > 0) {
    const state = prOverall?.state || prOverall?.status || "OPEN";
    pullRequests.push({
      name: `${prCount} linked pull request${prCount === 1 ? "" : "s"}`,
      status: state,
      url: prOverall?.url || null,
    });
    const details = asArray(
      devSummary.pullRequest?.byInstanceType
        ? Object.values(devSummary.pullRequest.byInstanceType)
        : []
    );
    for (const group of details) {
      for (const pr of asArray(group.pullRequests || group.details)) {
        pullRequests.push({
          name: pr.name || pr.title || `PR ${pr.id || ""}`.trim(),
          status: pr.status || pr.state || state,
          url: pr.url || null,
        });
      }
    }
  }

  const buildOverall = devSummary.build?.overall || devSummary.builds?.overall;
  const buildState = (buildOverall?.state || buildOverall?.status || "").toUpperCase();
  if (buildState === "FAILED" || buildState === "ERROR" || buildState === "FAILING") {
    failedChecks.push({
      name: "CI / build checks",
      status: buildState,
      url: buildOverall?.url || null,
    });
  }

  // Some Jira Software payloads leave overall.count at 0 even when a
  // nested detail is present. Prefer visible:true whenever the envelope
  // itself loaded successfully.
  if (
    devSummary.errorMessage &&
    !devSummary.pullRequest &&
    !devSummary.build &&
    !devSummary.review
  ) {
    visibilityGaps.push(`Can't see development information (${devSummary.errorMessage}).`);
    return { visible: false, pullRequests: [], failedChecks: [] };
  }

  return {
    visible: true,
    pullRequests: uniqueBy(pullRequests, (item) => item.name + item.status),
    failedChecks,
  };
}

function decisionsFromConfluenceLinks(remoteLinks) {
  const decisions = [];
  for (const link of remoteLinks) {
    const object = link.object || {};
    const url = object.url || link.url || "";
    const title = object.title || link.title || "Linked page";
    const application = (link.application?.type || link.application?.name || "").toLowerCase();
    const isConfluence =
      application.includes("confluence") ||
      /atlassian\.net\/wiki|confluence/i.test(url);
    if (!isConfluence) {
      continue;
    }
    const summary = object.summary || "";
    decisions.push({
      text: summary || title,
      sourceLabel: `Confluence: ${title}`,
      url: url || null,
      kind: "confluence",
    });
  }
  return decisions;
}

function decisionsFromText(sourceLabel, text, url, kind) {
  if (!text || !text.trim()) {
    return [];
  }
  const snippets = [];
  for (const rawLine of text.split(/\n+/)) {
    const line = rawLine.trim();
    if (line && DECISION_PATTERN.test(line)) {
      snippets.push({
        text: clip(line, 280),
        sourceLabel,
        url,
        kind,
      });
    }
  }
  return snippets;
}

function person(user) {
  if (!user) {
    return null;
  }
  return {
    displayName: user.displayName || user.name || "Unknown user",
    accountId: user.accountId || null,
  };
}

function asArray(value) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function numberOrZero(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(item);
  }
  return result;
}

function clip(text, max) {
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max - 1)}…`;
}
