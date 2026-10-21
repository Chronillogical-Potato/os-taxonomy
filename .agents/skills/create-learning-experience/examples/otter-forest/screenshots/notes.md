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
