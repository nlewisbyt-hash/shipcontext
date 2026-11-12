# ShipContext demo script (under 5 minutes)

This is the recording plan for the official Codegeist video. Judges must see the app working in Jira. The live official contest video has already been recorded locally at `docs/demo-assets/shipcontext-live-demo.mp4` (4 minutes 50 seconds / 290.0s, 1280×720, H.264 + AAC, about 5.7 MB). It is a screen recording of the production ShipContext install on the free Forge demo site ([https://one-atlas-tdlu.atlassian.net/browse/MSD-13](https://one-atlas-tdlu.atlassian.net/browse/MSD-13)), with English burned-in captions and no music. The local file `docs/demo-assets/shipcontext-ship42-local-preview.mp4` remains a captioned walkthrough of the canned SHIP-42 demo data only; it is **not** a screen recording of the live install and is **not** a YouTube-ready submission by itself.

The local recording exists. Still needed before a formal Submit:

1. Upload that recording to YouTube as a **public** video under five minutes, with no third-party trademarks or copyrighted music. There is not yet a public YouTube URL.
2. Paste that YouTube URL on the Devpost submission form when Submit is authorized. Formal Submit is **not** authorized yet.

## Suggested shot list (English, about 4 minutes)

**0:00–0:25 — The problem**  
On camera or over a Jira issue list: “When a software team is about to ship, the answer to ‘can we ship this?’ is usually scattered across comments, Confluence decisions, pull requests, and failed checks. ShipContext is a Forge issue-context panel that gathers that into one short Ship or Wait brief.”

**0:25–0:50 — Open the app**  
Open Jira on the demo site. Open a work item (create one if needed: title “Release billing v2.4 to production”, assign someone, add an unresolved sub-task “Verify webhook retries”, and a comment such as “We decided to ship only after checkout tests are green.”). In the right-hand context area, expand **ShipContext**. Optionally also open the wider **ShipContext** issue panel from the Apps menu.

**0:50–2:30 — Walk the live panel**  
Point to each section, slowly:

1. The Ship / Wait recommendation and the next step.
2. What’s decided, including source labels and links.
3. Who is responsible (assignee and reporter).
4. Blockers (unresolved sub-tasks, failed checks, missing PR if development info is visible).
5. Any **Can’t see …** lines, and say the app does not pretend missing data is empty.

If the live issue is sparse, click **Demo scenario** and walk the canned SHIP-42 case (expected recommendation: **Wait**, because CI failed on PR #184 and sub-task SHIP-55 is still open). Then click **This issue** to return to live fields.

**2:30–3:40 — How it is built**  
Briefly: this is an Atlassian Forge app in the **Apps for Software Teams** category. It uses `jira:issueContext` and `jira:issuePanel`, UI Kit, and read-only Jira scopes `read:jira-work` and `read:jira-user`. Teamwork Graph and Rovo are not in this version and should not be claimed. Mention that judges install it with the installation link from Forge “Start sharing your app” (once that link has been copied from the Developer Console Distribution page). Do not show secrets or API tokens.

**3:40–4:20 — Close**  
“ShipContext is for software teams who need a short, honest ship-or-wait answer on the issue they already have open. Thank you.”

## Recording notes

- Keep the total runtime under five minutes. Judges are not required to watch beyond that.
- Use English, or add English captions.
- Do not include copyrighted music.
- Do not show the owner’s password, API token, or vault contents.
- After recording, confirm the panel in the video matches the installed production app on the demo site.
