# Local test notes for ShipContext

These checks run on the development box and do **not** need an Atlassian site, `forge login`, or a paid plan. They also do not deploy or submit the contest entry.

## Prerequisites already on this box

- Node.js v24.22.1 (matches the Forge `nodejs24.x` runtime)
- npm 11
- Forge CLI `@forge/cli` 15.1.0, installed for the `box` user at `~/.local/bin/forge`

Add the CLI to `PATH` if a new shell does not see it:

```bash
export PATH="$HOME/.local/bin:$PATH"
forge --version
```

## Install dependencies and run the offline checks

```bash
cd /workspace/competitions/codegeist-shipcontext
npm install
npm test
npm run preview
```

Expected results:

- `npm test` exits 0. It covers the ship / wait rules, demo issue `SHIP-42`, decision extraction from ADF text and Confluence remote links, and the rule that missing development information is a visibility gap, not a missing pull request.
- `npm run preview` prints a text version of the demo panel. It should recommend **WAIT**, mention open sub-task `SHIP-55`, and mention failed CI on pull request #184.

You can also point the preview script at a JSON file:

```bash
# Either a parsed-issue object, or a raw { issue, remoteLinks, devSummary, errors } payload
node scripts/preview-context.js path/to/payload.json
```

## What these checks do not prove

They do not prove that the UI Kit panel still renders inside Jira after a later change, or that a new `forge deploy` / `forge install` will succeed. The app is already deployed to the Forge development and production environments (version **2.1.0**) and installed on the official free Forge demo site [https://one-atlas-tdlu.atlassian.net](https://one-atlas-tdlu.atlassian.net) (due to expire on **2027-02-10**). See the Install section in [README.md](../README.md).

This box has no Secret Service / libsecret keychain, so the Forge CLI should use `FORGE_EMAIL` and `FORGE_API_TOKEN` from the environment, not `forge login`. Do not put the token in this repository.

Do not run `forge deploy`, `forge register`, `forge site provision`, or `forge install` unless a real bug requires a code fix and a redeploy is explicitly agreed. If any of those commands, or a console page, asks for payment, a credit card, or a paid edition, stop and do not continue. Do not change Distribution settings.

## Suggested live-site smoke test (after a free install)

1. Create a story titled "Release billing v2.4 to production".
2. Assign it, add an unresolved sub-task "Verify webhook retries", and comment: "We decided to ship only after checkout tests are green."
3. If the site can link a Confluence page or a PR, add those too.
4. Open the issue, expand **ShipContext**, and confirm the recommendation, sources, and "Can't see" lines.
5. Click **Demo scenario** and confirm the canned `SHIP-42` walkthrough still appears.
6. Collapse the context panel and check that the Ship / Wait lozenge matches the recommendation.

These live-site steps have already been run on the production install at [https://one-atlas-tdlu.atlassian.net](https://one-atlas-tdlu.atlassian.net). The official recording of that walkthrough, starting at [MSD-13](https://one-atlas-tdlu.atlassian.net/browse/MSD-13), is `docs/demo-assets/shipcontext-live-demo.mp4`. Repeat the steps if you need to confirm a later change.
