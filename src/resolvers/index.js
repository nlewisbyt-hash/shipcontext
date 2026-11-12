import resolverModule from "@forge/resolver";
import api, { route } from "@forge/api";
import { getDemoParsedIssue } from "../lib/demo-data.js";
import { parseIssue } from "../lib/parse-issue.js";
import { recommend, toViewModel } from "../lib/recommendation.js";
import { getConstructor } from "../lib/resolver-class.js";

const Resolver = getConstructor(resolverModule);
const resolver = new Resolver();

resolver.define("getShipContext", async (request) => {
  const useDemo = Boolean(request.payload?.useDemo);
  const issue = request.context?.extension?.issue;
  if (useDemo || !issue?.id) {
    return buildDemoView();
  }
  return buildLiveView(issue);
});

export const handler = resolver.getDefinitions();

export async function dynamicProperties(payload) {
  const issue = payload?.extension?.issue;
  let view;
  try {
    view = issue?.id ? await buildLiveView(issue) : buildDemoView();
  } catch {
    return {
      status: {
        type: "lozenge",
        value: { label: "Check", type: "default" },
      },
    };
  }
  const verdict = view.recommendation?.verdict;
  if (verdict === "SHIP") {
    return {
      status: {
        type: "lozenge",
        value: { label: "Ship", type: "success" },
      },
    };
  }
  if (verdict === "WAIT") {
    return {
      status: {
        type: "lozenge",
        value: { label: "Wait", type: "removed" },
      },
    };
  }
  return {
    status: {
      type: "lozenge",
      value: { label: "Check", type: "default" },
    },
  };
}

export function buildDemoView() {
  const parsed = getDemoParsedIssue();
  return toViewModel(parsed, recommend(parsed), "demo");
}

export async function buildLiveView(issueRef) {
  const errors = [];
  const issueId = issueRef.id;
  const issue = await getJson(
    route`/rest/api/3/issue/${issueId}?fields=summary,status,assignee,reporter,issuelinks,subtasks,comment,description,issuetype,priority,updated,project,created`,
    errors,
    "this issue"
  );
  const remoteLinks = await getJson(
    route`/rest/api/3/issue/${issueId}/remotelink`,
    errors,
    "remote / Confluence links"
  );
  const devSummary = await getJson(
    route`/rest/dev-status/latest/issue/summary?issueId=${issueId}`,
    errors,
    "linked pull requests and CI checks"
  );

  const parsed = parseIssue({
    issue,
    remoteLinks,
    devSummary,
    errors,
  });
  if (issueRef.key && !parsed.key) {
    parsed.key = issueRef.key;
  }
  return toViewModel(parsed, recommend(parsed), "live");
}

async function getJson(path, errors, label) {
  try {
    const response = await api.asUser().requestJira(path, {
      headers: { Accept: "application/json" },
    });
    if (response.status === 401 || response.status === 403) {
      errors.push({
        code: "permission",
        message: `Can't see ${label} (permission denied).`,
      });
      return null;
    }
    if (response.status === 404) {
      errors.push({
        code: "not-found",
        message: `Can't see ${label} (not found or not available on this site).`,
      });
      return null;
    }
    if (!response.ok) {
      errors.push({
        code: "http",
        message: `Can't see ${label} (HTTP ${response.status}).`,
      });
      return null;
    }
    return await response.json();
  } catch (error) {
    errors.push({
      code: "error",
      message: `Can't see ${label} (${error?.message || "request failed"}).`,
    });
    return null;
  }
}
