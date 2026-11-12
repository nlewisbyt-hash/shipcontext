import React, { useCallback, useEffect, useState } from "react";
import ForgeReconciler, {
  Button,
  Heading,
  Inline,
  Link,
  Lozenge,
  SectionMessage,
  Spinner,
  Stack,
  Text,
  User,
  useProductContext,
} from "@forge/react";
import { invoke } from "@forge/bridge";

const App = () => {
  const productContext = useProductContext();
  const [view, setView] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useDemo, setUseDemo] = useState(false);

  const load = useCallback(
    async (demo) => {
      setLoading(true);
      setError(null);
      try {
        const result = await invoke("getShipContext", { useDemo: demo });
        setView(result);
      } catch (err) {
        setError(err?.message || "The ShipContext resolver failed to run.");
        setView(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!productContext) {
      return;
    }
    load(useDemo);
  }, [productContext, useDemo, load]);

  const issueKey =
    view?.issue?.key || productContext?.extension?.issue?.key || "this issue";

  return (
    <Stack space="space.200">
      <Stack space="space.050">
        <Heading as="h2" size="medium">
          ShipContext
        </Heading>
        <Text size="small" color="color.text.subtle">
          A short ship-or-wait brief for software teams, built from {issueKey}.
        </Text>
      </Stack>

      <Inline space="space.100">
        <Button
          appearance={useDemo ? "default" : "primary"}
          onClick={() => setUseDemo(false)}
          isDisabled={loading || !useDemo}
        >
          This issue
        </Button>
        <Button
          appearance={useDemo ? "primary" : "default"}
          onClick={() => setUseDemo(true)}
          isDisabled={loading || useDemo}
        >
          Demo scenario
        </Button>
      </Inline>

      {loading && (
        <Inline space="space.100" alignBlock="center">
          <Spinner size="medium" label="Loading ShipContext" />
          <Text>Loading context…</Text>
        </Inline>
      )}

      {!loading && error && (
        <SectionMessage appearance="error" title="Couldn't load context">
          <Text>{error}</Text>
        </SectionMessage>
      )}

      {!loading && view && <ShipContextView view={view} />}
    </Stack>
  );
};

function ShipContextView({ view }) {
  const rec = view.recommendation || {};
  const isShip = rec.verdict === "SHIP";
  const isDemo = view.source === "demo";

  return (
    <Stack space="space.200">
      <SectionMessage
        appearance={isShip ? "success" : "warning"}
        title={isShip ? "Recommendation: Ship" : "Recommendation: Wait"}
      >
        <Text>{rec.reason}</Text>
        <Text weight="medium">Next step: {rec.nextStep}</Text>
      </SectionMessage>

      {isDemo && (
        <SectionMessage appearance="discovery" title="Demo data">
          <Text>
            Showing the fictional SHIP-42 walkthrough, not the current issue's
            live fields. Switch back to "This issue" to use Jira data.
          </Text>
        </SectionMessage>
      )}

      <IssueLine view={view} />
      <Section title="What's decided">
        <DecisionList decisions={view.decisions} />
      </Section>
      <Section title="Who is responsible">
        <Owners owners={view.owners} />
      </Section>
      <Section title="Blockers">
        <BlockerList blockers={view.blockers} />
      </Section>
      {view.visibilityGaps?.length > 0 && (
        <Section title="Can't see">
          <Stack space="space.050">
            {view.visibilityGaps.map((gap) => (
              <Text key={gap} size="small">
                {gap}
              </Text>
            ))}
          </Stack>
        </Section>
      )}
    </Stack>
  );
}

function IssueLine({ view }) {
  const issue = view.issue || {};
  return (
    <Stack space="space.050">
      <Text weight="medium">
        {issue.key || "Issue"} — {issue.summary || "Untitled"}
      </Text>
      <Inline space="space.100" alignBlock="center">
        {issue.status ? (
          <Lozenge
            appearance={
              issue.statusCategory === "done"
                ? "success"
                : issue.statusCategory === "new"
                  ? "new"
                  : "inprogress"
            }
          >
            {issue.status}
          </Lozenge>
        ) : null}
        {issue.issueType ? <Text size="small">{issue.issueType}</Text> : null}
      </Inline>
    </Stack>
  );
}

function Section({ title, children }) {
  return (
    <Stack space="space.075">
      <Heading as="h3" size="small">
        {title}
      </Heading>
      {children}
    </Stack>
  );
}

function DecisionList({ decisions }) {
  if (!decisions?.length) {
    return (
      <Text size="small" color="color.text.subtle">
        No decisions were found in linked Confluence pages, the description, or
        comments.
      </Text>
    );
  }
  return (
    <Stack space="space.100">
      {decisions.map((decision, index) => (
        <Stack key={`${decision.sourceLabel}-${index}`} space="space.025">
          <Text>{decision.text}</Text>
          <Text size="small" color="color.text.subtle">
            {decision.url ? (
              <Link href={decision.url} openNewTab>
                {decision.sourceLabel}
              </Link>
            ) : (
              decision.sourceLabel
            )}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}

function Owners({ owners }) {
  return (
    <Stack space="space.050">
      <PersonRow label="Assignee" person={owners?.assignee} />
      <PersonRow label="Reporter" person={owners?.reporter} />
    </Stack>
  );
}

function PersonRow({ label, person }) {
  if (!person) {
    return (
      <Text>
        {label}: Unassigned / not visible
      </Text>
    );
  }
  if (person.accountId) {
    return (
      <Text>
        {label}: <User accountId={person.accountId} />
      </Text>
    );
  }
  return (
    <Text>
      {label}: {person.displayName}
    </Text>
  );
}

function BlockerList({ blockers }) {
  if (!blockers?.length) {
    return (
      <Text size="small" color="color.text.subtle">
        None visible.
      </Text>
    );
  }
  return (
    <Stack space="space.075">
      {blockers.map((blocker) => (
        <Inline key={blocker.id} space="space.075" alignBlock="start">
          <Lozenge appearance="removed">{blocker.kind}</Lozenge>
          {blocker.url ? (
            <Text>
              <Link href={blocker.url} openNewTab>
                {blocker.text}
              </Link>
            </Text>
          ) : (
            <Text>{blocker.text}</Text>
          )}
        </Inline>
      ))}
    </Stack>
  );
}

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
