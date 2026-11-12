# ShipContext

A Forge app for software teams. Open a Jira work item and ShipContext answers a short question: **can we ship this, or should we wait?**

It is an issue-context panel (plus a matching issue panel) that gathers what has already been decided, who is responsible, which blockers are still open, and a deterministic **Ship** or **Wait** recommendation with one next step.

This project is an entry in [Codegeist 2026](https://codegeist2026.devpost.com/), category **Apps for Software Teams**. Official rules: [codegeist2026.devpost.com/rules](https://codegeist2026.devpost.com/rules).

## Contest status

- Formally **Joined** on Devpost as `nlewisbyt` on 12 November 2026 (Asia/Shanghai).
- **Not Submitted** to Devpost. Do not click Submit on Devpost until the owner agrees.
- A public GitHub repository is being prepared. The tree is ready to push to an empty public repository under [`nlewisbyt-hash`](https://github.com/nlewisbyt-hash) once that URL is provided. Nothing has been pushed yet, and no remote is configured.
- Registered as a Forge app named **ShipContext** in Developer Space `nlewisbyt`. App id: `ari:cloud:ecosystem::app/61606a28-83bc-474b-99d9-fd893a79d557`.
- Deployed to the Forge **development** and **production** environments (app version **2.1.0**, redeployed 12 November 2026 after a production resolver crash fix: `new Resolver()` failed because the ESM/webpack default import of `@forge/resolver` was not the class).
- Installed on the official free Forge demo site [one-atlas-tdlu.atlassian.net](https://one-atlas-tdlu.atlassian.net) (Jira, both the development and production app environments). The CLI reported this demo site as **active** and due to expire on **2027-02-10**. Developer console installations: [ShipContext installations](https://developer.atlassian.com/console/myapps/61606a28-83bc-474b-99d9-fd893a79d557/monitoring/installations).
- Distribution status is **Sharing**, **Jira only**. The Marketplace listing is still **Not currently listed**. No paid plan was started.
- Authorized vendor fields saved in the Developer Console: Company/Department **Independent**; customer support contact [nlewisbyt@gmail.com](mailto:nlewisbyt@gmail.com); privacy policy [https://shipcontext-privacy.getbilltrack.workers.dev/](https://shipcontext-privacy.getbilltrack.workers.dev/); Terms of Service left empty (**Not provided**); app owner **Baoquan Yang**; Stores personal data? **No**.
- Judges installation / share link (exact, Jira only):

https://developer.atlassian.com/console/install/61606a28-83bc-474b-99d9-fd893a79d557?signature=AYABeKSbyOXvVelKfG5eZUu4hIMAAAADAAdhd3Mta21zAEthcm46YXdzOmttczp1cy13ZXN0LTI6NzA5NTg3ODM1MjQzOmtleS83MDVlZDY3MC1mNTdjLTQxYjUtOWY5Yi1lM2YyZGNjMTQ2ZTcAuAECAQB4CxqLTo9l4lqXuFjNim1xJM%2Bp%2F3TVP9xHS2BrU5DRRucBLcsg2IsiIAznbFxdzBlqxwAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDCwqDVudt0JAwbk9%2BAIBEIA7qQgQn6wUd4HkUlYF3O97MKZVgYN3aDm2IdQ1eR437eSgP7WcMVN%2BkKwHoXXNedjr2loNF2xI86S57L0AB2F3cy1rbXMAS2Fybjphd3M6a21zOmV1LXdlc3QtMTo3MDk1ODc4MzUyNDM6a2V5LzQ2MzBjZTZiLTAwYzMtNGRlMi04NzdiLTYyN2UyMDYwZTVjYwC4AQICAHi9bVMAkme4qVQX1fQHo6ePw3H40A7cGfz7yrmSfBWMXgHa7lgg1hWIPXyz95m%2F%2BgQkAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMGYpVMmFEpKsSeacQAgEQgDuVN2C3gcQGWdV7FBkqYnan1b6clx%2BclU5184b%2FOPlWzZle8LsmLe2HUb8cYXLgpFPBZBh6UnVg9fyixAAHYXdzLWttcwBLYXJuOmF3czprbXM6dXMtZWFzdC0xOjcwOTU4NzgzNTI0MzprZXkvNmMxMjBiYTAtNGNkNS00OTg1LWI4MmUtNDBhMDQ5NTJjYzU3ALgBAgIAeDYASx0XCjkny4iLV6vz%2BKtEGSGT6kdt0QRpkn6D%2FlVEAUz8fc7ValesqWbC7abBpusAAAB%2BMHwGCSqGSIb3DQEHBqBvMG0CAQAwaAYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAzIvkfcBQFEbLIyUcICARCAO0wG38OOrpcHYmPujMXoEllSEprGbq1Gq3bVGIwp8ZINvzNFnIlM6HSk%2F19xF0rM0qyqrDpNmFFID8ZcAgAAAAAMAAAQAAAAAAAAAAAAAAAAAItDSGqxF97bvKB9lBVsW%2Fb%2F%2F%2F%2F%2FAAAAAQAAAAAAAAAAAAAAAQAAADKfyzkuUL4THGAI9sMFAuKtIXVP614KOp31KYmjxegO%2F9ZkhOOGfKJmGwdbcFW2hbgbuagTPsX1%2B6ZIwdux1sqey9A%3D&product=jira

Submission deadline: **23 December 2026, 04:00 Asia/Shanghai** (22 December 2026, 12:00 Pacific Time). Team 2027 tickets, if awarded, are a prize, not an attendance requirement.

## What the panel shows

On a Jira issue, ShipContext displays:

1. **What's decided** — excerpts from linked Confluence pages, the description, or comments when they look like a decision, each with a source label and link when one exists.
2. **Who is responsible** — reporter and assignee (using the Forge `User` component when an account ID is available).
3. **Blockers** — unresolved sub-tasks, failed CI / build checks, and a missing linked pull request when development information is actually visible.
4. **Recommendation** — Ship or Wait, plus one next step.

If a field cannot be read, the panel says **Can't see …** instead of pretending the field is empty. Teamwork Graph and Rovo are not part of this first scaffold; they remain optional later work, and will only be claimed if the corresponding Forge modules are actually declared and used.

A **Demo scenario** button shows a fictional issue, `SHIP-42` (Release billing v2.4 to production), so judges can walk the same path even on a sparse site. That demo is also available offline; see [docs/LOCAL_TEST.md](docs/LOCAL_TEST.md).

## How this meets the technical requirement

| Requirement | This scaffold |
| --- | --- |
| Built on Forge | `manifest.yml`, UI Kit 2 (`render: native`), resolver, Node.js 24 runtime |
| At least one Atlassian product | Jira: `jira:issueContext` and `jira:issuePanel`, read-only Jira REST calls |
| Judges can install it | Yes. Distribution is **Sharing**, Jira only. Use the installation link in [Contest status](#contest-status) (it ends with `&product=jira`). The Marketplace listing is still **Not currently listed**. |
| Bonus (Rovo / Teamwork Graph) | Not implemented in this scaffold. Do not tick those bonus boxes yet. |

The recommendation rules are deterministic and documented in `src/lib/recommendation.js`:

1. Wait if a visible CI / build check failed.
2. Wait if a sub-task is still unresolved.
3. Wait if there is no assignee and the issue is not Done.
4. Wait if development information is visible, the issue is not Done, and no pull request is linked. If development information is not visible, record a visibility gap instead.
5. Otherwise Ship.

## Permissions

The app requests only:

- `read:jira-work` — read the issue, sub-tasks, comments, and remote links
- `read:jira-user` — resolve user names and avatars

It does not write issue data and does not call paid Atlassian APIs. Development-information is requested best-effort from Jira Software's `/rest/dev-status` endpoint; if that endpoint is not available, the panel reports that it can't see checks or pull requests.

## Local check (no Atlassian site required)

This machine already has Node.js and the Forge CLI (`@forge/cli` 15.1.0). From this directory:

```bash
npm install
npm test
npm run preview
```

`npm run preview` prints the `SHIP-42` demo panel as plain text. Details are in [docs/LOCAL_TEST.md](docs/LOCAL_TEST.md).

## Install and try it (current development install)

The app is already registered, deployed to **development** and **production**, and installed on the free Forge demo site [https://one-atlas-tdlu.atlassian.net](https://one-atlas-tdlu.atlassian.net) in both environments. No paid plan was started.

Site admins can install the production app on their own Jira site with the judges installation / share link in [Contest status](#contest-status). Distribution is **Sharing**, Jira only. The Marketplace listing is still **Not currently listed**.

To try it:

1. Sign in to Atlassian as the account that owns this demo site, then open [https://one-atlas-tdlu.atlassian.net](https://one-atlas-tdlu.atlassian.net).
2. Open any Jira work item (or create one).
3. In the right-hand issue context area, expand **ShipContext**. The collapsed label can show a Ship / Wait lozenge.
4. You can also open **ShipContext** from the issue Apps / issue panel menu for a wider view.
5. Use **Demo scenario** to see the canned `SHIP-42` walkthrough, or **This issue** to use live fields.

To iterate: `forge tunnel` for a local hot reload, then `forge deploy` when you are ready to keep the change. If you change scopes in `manifest.yml`, run `forge deploy` and `forge install --upgrade`.

This box has no Secret Service keychain, so the Forge CLI uses `FORGE_EMAIL` and `FORGE_API_TOKEN` from the environment, not `forge login`. Do not put the token in this repository. **Do not start a paid plan.** If a later page or CLI prompt asks for a credit card, a payment method, or a paid edition, stop and do not continue.

## Demo preview and official video

A local, captioned SHIP-42 walkthrough (about 59 seconds, under the five-minute limit) is at [docs/demo-assets/shipcontext-ship42-local-preview.mp4](docs/demo-assets/shipcontext-ship42-local-preview.mp4). It is rendered from the app’s canned demo data and is clearly labeled as a local preview, **not** a recording of the live Jira install. It is **not** the official contest video.

The live official contest video already exists locally at [docs/demo-assets/shipcontext-live-demo.mp4](docs/demo-assets/shipcontext-live-demo.mp4). It is a 4-minute-50-second (290.0s), 1280×720, H.264 + AAC screen recording (about 5.7 MB) of the production ShipContext install on the free Forge demo site, starting at [https://one-atlas-tdlu.atlassian.net/browse/MSD-13](https://one-atlas-tdlu.atlassian.net/browse/MSD-13). The expanded panel in the recording is labeled **ShipContext**, not **ShipContext DEV**. It has English burned-in captions and no music (the AAC track is silent). It is **not** a reuse of the local preview file.

On MSD-13 the production panel shows Recommendation: **Ship**, What’s decided, Who is responsible (assignee and reporter Alana Grant), Blockers none visible, and **Can’t see** linked pull requests and CI checks (Authentication Required). The recording then opens **Demo scenario** for the fictional SHIP-42 brief: Recommendation: **Wait**, failed CI on pull request #184, the next step, Confluence and feature-flag decisions, assignee Priya Shah / reporter Alex Chen, and open sub-task SHIP-55.

There is not yet a public YouTube URL for that recording; no YouTube link is invented here. Formal Devpost Submit has **not** been done and is **not** authorized.

The shot list for the official video is in [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md).

## What is still required before a formal Submit

- A public YouTube demo under five minutes of the live Jira install, plus a public repository, as required by the official rules.
- Owner approval before any Devpost Submit, and before any paid plan.

## Project layout

```
manifest.yml                 Forge modules, runtime, and read-only scopes
src/frontend/index.jsx       UI Kit issue-context / issue-panel UI
src/resolvers/index.js       getShipContext resolver and dynamic lozenge
src/lib/                     Pure parse + recommendation + demo data
scripts/preview-context.js   Offline text preview
test/                        Node.js unit tests
docs/LOCAL_TEST.md           Local test notes
设计说明.md                   Original Chinese design notes
```

The original design notes remain in [设计说明.md](设计说明.md). This README is the English, judge-facing description.
