/**
 * Deterministic ship / wait recommendation.
 *
 * Rules, in order:
 *  1. WAIT if any failed development / CI check is visible.
 *  2. WAIT if any sub-task is still unresolved.
 *  3. WAIT if there is no assignee and the issue is not already Done.
 *  4. WAIT if development information is visible, the issue is not Done,
 *     and there is no linked pull request. If development information is
 *     not visible, this is recorded as a visibility gap instead — the
 *     app must not pretend that no PR exists.
 *  5. Otherwise SHIP.
 *
 * "Can't see X" gaps never count as evidence that X is fine.
 */

export function recommend(parsed) {
  const blockers = [];
  const visibilityGaps = [...(parsed.visibilityGaps || [])];

  for (const check of parsed.failedChecks || []) {
    blockers.push({
      id: `check:${check.name}`,
      kind: "check",
      text: `${check.name} failed`,
      url: check.url || null,
    });
  }

  for (const subtask of parsed.unresolvedSubtasks || []) {
    blockers.push({
      id: `subtask:${subtask.key}`,
      kind: "subtask",
      text: `${subtask.key} ${subtask.summary} is still unresolved`,
      url: subtask.url || null,
    });
  }

  const isDone = parsed.statusCategory === "done";
  const hasAssignee = Boolean(
    parsed.assignee && (parsed.assignee.accountId || parsed.assignee.displayName)
  );

  if (!hasAssignee && !isDone) {
    blockers.push({
      id: "unassigned",
      kind: "owner",
      text: "No assignee is responsible for this issue",
      url: null,
    });
  }

  const pullRequests = parsed.pullRequests || [];
  if (parsed.devInfoVisible) {
    if (!isDone && pullRequests.length === 0) {
      blockers.push({
        id: "missing-pr",
        kind: "pull-request",
        text: "No linked pull request is visible for this issue",
        url: null,
      });
    }
  } else if (
    !visibilityGaps.some((gap) => /pull request|development/i.test(gap))
  ) {
    visibilityGaps.push("Can't see linked pull requests or CI checks.");
  }

  let verdict;
  let nextStep;
  let reason;

  if (blockers.length > 0) {
    verdict = "WAIT";
    reason = blockers[0].text;
    nextStep = nextStepForWait(blockers, parsed);
  } else if (isDone) {
    verdict = "SHIP";
    reason = "The issue is Done, with no open blockers visible to this app.";
    nextStep = "Confirm the release notes and watch production after deploy.";
  } else {
    verdict = "SHIP";
    reason = "No open blockers are visible in the context this app can read.";
    nextStep = nextStepForShip(parsed);
  }

  return {
    verdict,
    reason,
    nextStep,
    blockers,
    visibilityGaps,
  };
}

function nextStepForWait(blockers, parsed) {
  const first = blockers[0];
  if (first.kind === "check") {
    return "Fix the failing check on the linked pull request, then re-run CI.";
  }
  if (first.kind === "subtask") {
    return `Resolve ${first.text.split(" ")[0]} before considering a ship.`;
  }
  if (first.kind === "owner") {
    return "Assign someone who can own the remaining release work.";
  }
  if (first.kind === "pull-request") {
    return "Link the release pull request to this issue, or explain why one is not required.";
  }
  return parsed.assignee?.displayName
    ? `Ask ${parsed.assignee.displayName} to clear the first blocker.`
    : "Clear the first blocker, then refresh this panel.";
}

function nextStepForShip(parsed) {
  const status = (parsed.status || "").toLowerCase();
  if (status.includes("review")) {
    return "Finish review, merge the linked pull request, and deploy behind the agreed flag.";
  }
  if (status.includes("progress")) {
    return "Complete the remaining implementation, then run the release checks.";
  }
  return "Merge if needed, deploy, and watch the agreed launch checks.";
}

/**
 * Combine a parsed issue with a recommendation into the view-model the UI
 * and the text preview both consume.
 */
export function toViewModel(parsed, recommendation, source = "live") {
  return {
    source,
    issue: {
      id: parsed.id,
      key: parsed.key,
      summary: parsed.summary,
      status: parsed.status,
      statusCategory: parsed.statusCategory,
      issueType: parsed.issueType,
      projectKey: parsed.projectKey,
      projectName: parsed.projectName,
    },
    owners: {
      assignee: parsed.assignee,
      reporter: parsed.reporter,
    },
    decisions: parsed.decisions || [],
    blockers: recommendation.blockers,
    pullRequests: parsed.pullRequests || [],
    visibilityGaps: recommendation.visibilityGaps,
    recommendation: {
      verdict: recommendation.verdict,
      reason: recommendation.reason,
      nextStep: recommendation.nextStep,
    },
  };
}
