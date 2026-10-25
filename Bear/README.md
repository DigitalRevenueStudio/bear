# DRS Bear Hunt Setup Doctor — Beta 1.0

## Use
Open index.html (or the standalone HTML deliverable) in a modern browser. No build, account, API key, installation or internet request is required for the tool itself. External source pages require internet when clicked. The initial Jessie entry is a demonstration, not evidence that the visitor owns her.

## Deploy
Upload index.html to a static directory, for example /wos-bear-doctor/index.html. The proposed URL is not live yet. For a hosted page-builder site, host this static page on a platform that allows JavaScript and embed its HTTPS URL in an iframe, or integrate the HTML through your developer. Many rich-text editors remove script tags; pasting into a standard content box will not install it. No changes have been made to your existing website.

Suggested iframe (replace YOUR-HOST with the actual deployed host):
<iframe src="https://YOUR-HOST/wos-bear-doctor/" title="DRS Bear Hunt Setup Doctor" width="100%" height="1800" style="border:0" loading="lazy"></iframe>
Do not sandbox away scripts if embedding. Browser-local save and clipboard may be restricted by iframe permissions; JSON export and manual report copy are fallbacks. Adjust height after mobile testing.

## Files
index.html is the self-contained application. engine.js, heroes.json and tests.js are readable development/test references; the standalone HTML embeds its own copies. Editing a reference file does not automatically change index.html. When extending rules, update the embedded copy too, or refactor the application into separately loaded files before deployment.

## Current scope
Leader structure, first-slot joiner checks for six reviewed starter heroes, all Gen 2–17 headline hero names plus selected early heroes, cross-march hero conflicts, generation mismatches, duplicate class errors, troop inventory and user-entered deployment capacity. Alternative setups can intentionally reuse heroes. Reports, JSON export/import, local save/load, print view. Troop ratios are displayed, not optimised.

## Deliberate limitations
No exact damage simulation; no automatic strongest leader trio; no late-generation skill verdicts; no inference of tied joiner selection; no validation of in-game march unlocks, rarity skill caps or star gates. Reviewed mechanics are published descriptions, not controlled battle tests. The first-skill detector does not account for manual Captain preference or guarantee a contribution is selected. Four joining skill slots are rally-wide, not per player. The roster is not a complete collection of every hero in the game.

## Privacy
No external scripts, fonts, analytics, network calls or credential prompts. Data is stored only when the visitor clicks Save. Delete saved copy removes that key only; Reset clears the screen but keeps the save. JSON imports are structurally validated and limited to 100 KB. All imported display text is escaped.

## Verification
Pure-rule tests: 14 passed with Node.js during generation. Visual layout, live browser interactions, downloads, clipboard, storage and host iframe behaviour still need manual device testing. Run `node tests.js` to repeat rule tests. Launch checklist: check Chrome/Safari on phone, keyboard controls, add/remove marches, JSON import/export, save/load/delete, print, clipboard fallback, and source links. No claim of complete end-to-end browser testing is made.

## Expanding the data
Add reviewed first Expedition skills with source URLs, skill-level ladders and applicable conditions. Do not infer later heroes' roles from class or generation. Add unit tests per rule. Avoid silently changing uncertain effects into numerical rankings. Keep defensive, Attack, damage dealt, Lethality and enemy Defence changes distinct.

Sources reviewed 25 October 2026: official-hosted Bear Hunt and advanced rally guides, beginner Bear guide, and Jessie/Jasser/Seo-yoon/Sergey/Bahiti profiles linked in the app. Older guides contain obsolete lists or contradictory deployment advice; they are not used as complete rankings.
