/**
 * Plain-text rendering of a ShipContext view-model. Used by the local
 * preview script and unit tests; the Forge UI has its own layout.
 */
export function formatViewModel(view) {
  const rec = view.recommendation || {};
  const issue = view.issue || {};
  const owners = view.owners || {};
  const lines = [];

  lines.push(`ShipContext — ${rec.verdict || "UNKNOWN"}`);
  lines.push(`Source: ${view.source}`);
  lines.push("");
  lines.push(
    `Issue: ${issue.key || "?"} — ${issue.summary || ""} [${issue.status || "Unknown"}]`
  );
  lines.push(`Recommendation: ${rec.verdict}`);
  if (rec.reason) {
    lines.push(`Reason: ${rec.reason}`);
  }
  if (rec.nextStep) {
    lines.push(`Next step: ${rec.nextStep}`);
  }
  lines.push("");
  lines.push("What's decided");
  if (!view.decisions?.length) {
    lines.push("- No decisions were found in linked Confluence pages, the description, or comments.");
  } else {
    for (const decision of view.decisions) {
      const url = decision.url ? ` (${decision.url})` : "";
      lines.push(`- ${decision.text} — ${decision.sourceLabel}${url}`);
    }
  }
  lines.push("");
  lines.push("Who is responsible");
  lines.push(`- Assignee: ${nameOf(owners.assignee)}`);
  lines.push(`- Reporter: ${nameOf(owners.reporter)}`);
  lines.push("");
  lines.push("Blockers");
  if (!view.blockers?.length) {
    lines.push("- None visible.");
  } else {
    for (const blocker of view.blockers) {
      lines.push(`- [${blocker.kind}] ${blocker.text}`);
    }
  }
  if (view.visibilityGaps?.length) {
    lines.push("");
    lines.push("Can't see");
    for (const gap of view.visibilityGaps) {
      lines.push(`- ${gap}`);
    }
  }
  return lines.join("\n");
}

function nameOf(person) {
  return person?.displayName || "Unassigned / not visible";
}
