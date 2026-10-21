# Capture provenance and limits

Captured from this folder's [exact HTML snapshot](../experience.html) on
2026-10-21 in headless Chrome using software WebGL, with HTTP/HTTPS blocked
and the browser offline. Desktop images are 1440 × 900; narrow images are
390 × 844 from a fresh mobile load. These are browser reference images,
not physical-device or child-use evidence.

| Capture | Actual state |
| --- | --- |
| [entry.png](entry.png) | Illustrated opening before starting. |
| [narrow.png](narrow.png) | Same opening on a fresh mobile load. |
| [lesson-entry.png](lesson-entry.png) | Recover the forest challenge, paused before intervention, reached through the investigation menu; not the initial discovery scene. |
| [narrow-lesson.png](narrow-lesson.png) | Same paused rescue challenge on mobile, reached through the menu. |
| [interaction.png](interaction.png) | Share a rocky coast challenge running after an actual mussel-token intervention; five organism types and goal requirements are visible. |
| [assessment.png](assessment.png) | First rescue reflection question, before any response, with the goal flag arranged as described below. |
| [feedback.png](feedback.png) | Explanatory feedback after an actual incorrect, unassisted response to that question. |
| [vocabulary.png](vocabulary.png) | Otter definition opened from the rescue challenge's organism-token word; edits remain unchanged. |
| [vocabulary-narrow.png](vocabulary-narrow.png) | Same definition opened by touch on mobile; no organism added. |

## Bounded validation

The exact snapshot and the independently rebuilt portable page both passed
sampled real-control checks: start, otter/urchin discovery scenes, investigation
menu, pause/resume, organism addition, matched-time comparison, replay, rocky
coast and meadow trays, vocabulary gesture isolation, and reflection evidence.
The comparison branches reported equal elapsed model time. Replay returned a
fresh start. A wrong response remained incorrect and unassisted; a later
correct response after explicit Help remained assisted. Definitions did not
submit responses or change edits. Embedded Baloo 2 loaded; no browser console
or runtime errors, remote requests, unresolved build placeholders or external
script/module imports were observed in these checks.

## Arranged reflection state

To test reflection controls without completing a long ecological goal, browser
automation set the rescue challenge's live goal reference to `achieved: true`,
`held: 12` and `firstAt` equal to the current model time. It then used the actual
Compare, Back to the world and Finish investigation controls to open reflection.
World populations were not programmatically changed. This setup applies to
`assessment.png`, `feedback.png` and their corresponding reflection checks; it
does **not** demonstrate successful ecological restoration or held-goal
completion. Other listed screenshots use ordinary controls without arranged
goal state.

This pass did not exhaust the question bank, complete all four challenge goals,
validate the ecological model against empirical data, test physical touch
hardware or establish learning effectiveness. The rocky-coast and meadow tray
checks confirm available controls, not successful long-term ecosystem outcomes.
