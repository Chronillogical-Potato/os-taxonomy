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
| [camera-gesture.png](camera-gesture.png) | Rescue challenge after a real scene drag, wheel zoom, keyboard reset and subsequent arrow rotation; organism edits remain unchanged by these camera gestures. |
| [assessment.png](assessment.png) | First rescue reflection question, before any response, with the goal flag arranged as described below. |
| [feedback.png](feedback.png) | Explanatory feedback after an actual incorrect, unassisted response to that question. |
| [vocabulary.png](vocabulary.png) | Otter definition opened from the rescue challenge's organism-token word; edits remain unchanged. |
| [vocabulary-narrow.png](vocabulary-narrow.png) | Same definition opened by touch on mobile; no organism added. |

## Bounded validation

The current camera update passed 40 bounded assertions against the exact
snapshot and independently rebuilt portable page. Real input checked desktop
drag rotation, wheel zoom, keyboard arrows and plus/minus zoom, and R reset.
Dragging back to the starting point did not become a delete tap. On an emulated
mobile viewport, a two-finger pinch changed scene zoom without changing page
scale or organism edits. Lifting one finger, moving the surviving finger away
and back, then lifting it also caused no deletion. An ordinary organism tap
still removed one organism, and a tray icon still added one.

The same pass sampled cover/discovery/menu controls, vocabulary gesture
isolation, equal elapsed times in comparison branches, replay to a fresh
start, and a wrong unassisted reflection response after the disclosed setup.
The refreshed interaction capture uses an actual rocky-coast mussel addition.
Earlier canonical-import checks additionally covered the meadow tray and a
correct response after Help remaining assisted; these were not exhaustively
repeated for the camera-only change.

All nine original captures were refreshed from the current snapshot, and the
camera-gesture image was added. Embedded Baloo 2 loaded, and the current pass
observed no browser console/runtime errors or remote requests. This is a
browser-input smoke check, not testing on physical touch hardware.

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

## PR review regression checks

The screenshot set above was retained from the camera revision because these
review fixes do not change those compositions. A later bounded check used the
rebuilt exact snapshot and portable page to verify persistent reflection
exposure across replay, retention of an earlier independent success after an
unsuccessful revisit, and retention when a replayed goal is achieved again.
Reflection entry used the disclosed goal-flag setup. For the replay achievement
check, real plant/add controls first met the community predicates; only the
held-goal duration was accelerated to `31.99` before an actual simulation tick.
This tests evidence bookkeeping, not long-term goal stability.

The same check verified plain-text live announcers separate from interactive
vocabulary, stable announcement DOM writes and accessibility-tree live
properties. This is not a screen-reader listening test. Camera shortcuts
ignored Ctrl/Meta/Alt modifiers; immediate resize with animation frames held
preserved orbit, including retained orbit state on mobile. Exact inspection-pose
pixel continuity was not established: the additional comparison was inconclusive
while the inspection camera was easing; it is not claimed as a passed check.
Scene presses restored goal copy after help. Reduced-motion pose tests returned
zero body roll. Injected WebGL failure showed the existing warning and hid
unusable controls; WebGL console errors in that fault-injection test were
expected. No physical-device or ecological validation is implied.


## Button vocabulary fix · 2026-10-23

The current standalone HTML excludes buttons and other action controls and their
labels from vocabulary annotation. Earlier captures on this page are historical
where they show word help on controls, including organism tokens.

Chrome checks passed with network disabled on `file://` at 1280 × 900 and
390 × 900 with touch emulation. Clicking/tapping “Follow an otter” and “Follow an urchin” advanced discovery; the organism tray labels remained actionable.
Word help still opened from non-interactive lesson text and closed with Escape.
Both readable helpers also passed native/ARIA button, nested-label, disabled and
dynamically created control checks, with mouse/touch actions and native-button
Enter/Space activation. No page script errors occurred.
Screenshots were inspected for the phone Bee Builder and desktop Hidden Cubes
layouts. The check script and all ten fresh captures are retained locally in
`/tmp/marble-browser-checks/check-button-vocabulary.mjs` and
`/tmp/marble-button-vocabulary/`. This was a focused control regression check,
not a full reassessment of learning outcomes.
