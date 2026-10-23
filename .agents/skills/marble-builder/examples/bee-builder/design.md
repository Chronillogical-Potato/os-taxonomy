# Bee Builder

[Run the experience](experience.html) · [Example index](../../references/examples.md)

![Opening composition](screenshots/entry.png)

[First lesson screen](screenshots/lesson-entry.png) ·
[Central interaction](screenshots/interaction.png) ·
[Independent task before reveal](screenshots/assessment.png) ·
[Feedback](screenshots/feedback.png) · [Narrow layout](screenshots/narrow.png)

## Goal and representation

Around age nine, explore why hexagonal honeycomb is useful: no gaps between
rooms and less boundary length than equal-area squares or equilateral triangles.
Related anchors include `mt_zuOGOGFAKb` (shape attributes), `mt_wE7-Gs9ENL`
(Measuring Perimeters) and `mt_WtcFrxGOgw` (Perimeters of polygons). This is an
informal application, not mastery of all those topics or perimeter formulas.

Use this as the **2D counterexample to unnecessary 3D**. The target reasoning is
planar packing, equal area and boundary length. SVG gives exact geometry,
large scene targets and a crafted illustrated bee without camera complexity.

## Illustrated opening

The opening asks **“Why do bees use hexagons?”**, composed with the approved close-up honeycomb, botanical framing and bumblebee illustration.
One icon-plus-label “Let’s find out” action enters fresh practice; lesson controls
remain hidden and inert until then. Restart returns to the opening and clears
session evidence. The cover introduces the investigation without awarding credit
or revealing an independent answer. Its large question is the approved exception
to the lesson's small-title typography.

## Learning sequence and evidence

Explore circle gaps and square/hexagon packing. Compare equal-area rooms by
unfolding their boundaries into strips at a common scale. Join two rooms to see
why a shared wall is built once. Then place a fourth hexagon to share more walls,
and predict which of a fresh equal-area square/rectangle pair needs less wax.
The second task applies boundary reasoning without merely choosing a hexagon
again. Direct scene taps commit; buttons allow preview and explicit commitment.

First responses in both tasks must be correct without Help for the positive
independent-session message. Reveals, assistance and later challenge rounds
cannot retroactively count as first independent success. The no-gap property is
explored but not independently assessed. These two choices are modest evidence
of shared-wall and boundary reasoning, not a proof, open explanation or retention.
Optional triangles transfer the comparison without altering the core result.

## Contextual vocabulary

Technical terms have dashed underlines in non-interactive child-visible copy,
including the opening question where relevant. Action controls and their labels
are excluded. Hover, tap or keyboard focus opens one
brief meaning. These are generic language explanations, not task-specific hints;
opening them does not submit a response or change this experience's evidence.
Button and form labels retain their original accessible names and actions.

[Desktop word help](screenshots/vocabulary.png) ·
[Phone word help](screenshots/vocabulary-narrow.png) ·
[Shared vocabulary source](../vocabulary.js)

## What to inspect and reuse

- [Application](source/app.js): `vertices`, `perimeter`, `unfold` connect displayed
  shapes and strips; `sharedWalls`, `commit` and `showFinish` connect geometry to
  evidence. `tapTarget` adds keyboard-operable SVG actions.
- [Shell](source/shell.html): responsive framing, tactile buttons and typography.
- The bumblebee guide, flowers, honey drops, exact room faces and unfolded wax
  strips share a Marker Comic treatment: matte fills, hard shade planes and
  deliberate ink contours. Clip geometry preserves exact mathematical boundaries;
  invisible artwork overflow must not enlarge SVG tap targets.
- The bee's wings hinge at their roots and stop under reduced motion. Its compact,
  furry silhouette avoids a human smile or an exaggerated mascot face. Adapt the
  craft rather than reusing the bee everywhere.
- [anidoodle attribution](ANIDOODLE-NOTICE.txt) and [Apache 2.0 license](ANIDOODLE-LICENSE.txt)
  preserve the source style reference, Alex Greenshpun's anidoodle. The SVG art is
  original; the anidoodle engine, reference artwork and sound pack are not bundled.

## Limits and exceptions

Equal area implies equal capacity only with equal cell depth. Fixed thickness
lets boundary length stand for side-wall wax; bases, structural constraints and
real wax variation are omitted. Shared interior walls count once in construction:
outer perimeter alone is not the total amount of wax. Hexagons are compared with
specific regular tilings, not proved optimal over every conceivable partition.

The decorative guide is a bumblebee; the regular hexagonal honeycomb lesson
concerns honeybees, not bumblebee nest architecture.

This explains geometric advantages, not the biological mechanism of construction;
never claim bees consciously calculate an optimum or that this simulation models
wax physics. The snapshot's activity label plus stage title differs from the
current single-title budget. Preserve the current rule for new work unless an
exception is agreed. The opening packing picture is intentionally passive;
buttons change shapes, while later room targets support direct action. See
[capture notes](screenshots/notes.md) for actual checks, not effectiveness evidence.
