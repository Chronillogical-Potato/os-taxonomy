# Moon Visit

[Run the experience](experience.html) · [Example index](../../references/examples.md)

![Opening composition](screenshots/entry.png)

[Central interaction](screenshots/interaction.png) ·
[Independent task before reveal](screenshots/assessment.png) ·
[Feedback](screenshots/feedback.png) · [Narrow layout](screenshots/narrow.png)

## Goal and representation

For a learner around seven, connect reflected sunlight with the possibility of
seeing the Moon during daytime. Related taxonomy anchors are `mt_PiWZA8Z0ZJ`
(Sun, Moon & Stars) and `mt_15FduGRf5c` (The Moon's Orbit); this is narrower than
mastery of either topic. Identifying Earth, Moon and Sun is the starting point.

The learner turns Earth, then changes from a space overview to an observer's
local sky. Those views share model state. Looking around changes the camera,
not the positions used to decide whether the Moon is above the horizon.

## Learning sequence and evidence

Explore a daytime view, trace sunlight from Sun to Moon to observer, then predict
visibility in four fresh configurations before viewing the sky. Finally construct
the three-object light path independently. Practice rings, rays and observer
views are withheld in the independent phase; a hint records assistance.

The session's positive result requires the first four predictions to be correct
without help and the first causal path to be correct without help. A revealed
answer cannot be resubmitted for independent credit. These observations check
visibility reasoning and a selected causal sequence, not a spontaneous explanation,
retention, phase knowledge or actual sky observation. Binary predictions remain
guessable; do not import this exact count or all-correct rule as a default.

## What to inspect and reuse

- [Application](source/app.js): `toSky`, `predict`, `tapObject`, UI state and
  transitions; compare camera movement with physical model updates.
- [Geometry and evidence](source/model.mjs): `facts`, `makeTasks`, `scorePath`,
  `sessionEvidence` separate subject rules from presentation.
- [Observer view](source/ground-view.mjs), [landscape](source/ground-landscape.mjs)
  and [space effects](source/space-visuals.mjs): coherent directions at two scales.
- [Shell](source/shell.html): typography, in-object labels and narrow layout.

## Limits and exceptions

Distances, body sizes and apparent diameters are compressed or enlarged. This
is a visibility model, not a date-specific sky map or a promise of visibility on
any real day. Clouds, brightness thresholds, eclipses and refraction are omitted.
Sun effects and some shading are illustrative rather than the current flat,
outlined cel-shading benchmark. A hidden-Moon locator is an annotation, not a
Moon physically seen through Earth.

A fresh 390 × 844 mobile-emulation load is readable, but switching from desktop
to that viewport in the browser harness produced severely undersized text. The
[resize failure](screenshots/narrow-after-resize.png) is retained separately.
Check resize/orientation transitions and actual text size when adapting this
layout; physical-device behavior remains unverified.

The snapshot includes a timed feedback toast alongside the instruction. **Do not
copy that duplication:** new work replaces the single instruction with feedback.
Use the current component styling rather than treating every snapshot detail as
approved general guidance. Original companion validation notes are historical;
see the current [capture notes](screenshots/notes.md) for this import's checks.
