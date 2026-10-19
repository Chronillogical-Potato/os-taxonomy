# Visual direction and technical baseline

## The quality reference: Marble Water Lab

Inspect [Water Lab](https://withmarble.com/water-lab) in a browser when available.
If image inspection is available, inspect these bundled reference captures before
building: [glass view](visual/water-lab-glass.png) and
[atoms view](visual/water-lab-atoms.png). Captured from the public site on
2026-10-19 at 1440×900 in Chrome (software WebGL); these are dated design references,
not evidence of current site performance or instructional effectiveness. Do not
embed them as art in the child's experience.

The inspected reference centers a glass/material scene, switches the main view
to molecules, and retains the other scale as a small inset. A temperature change
updates the phenomenon immediately. Transfer this deliberate focus and connected
representation to the new goal; do not force a glass, a temperature slider, a dark
palette or this specific layout onto every subject. Water Lab is a visual and
manipulation reference, not a ready-made mastery assessment.

Use its rendered experience as a composition and interaction reference, not its
entire text content as a template. The required text budget here is stricter:
**one title and one instruction visible at a time**, with no other visible text.
The adult brief and asset credits are separate. Accessible names remain required.
If the live site cannot be viewed, use these criteria and report that limitation;
do not claim to have inspected its current appearance.

Build an inviting, art-directed interactive object/world that fills the learning
surface. The scene should be the thing the child explores; chrome should feel
secondary. Translate the reference's single focal experience, deliberate material,
light and motion treatment, and close relationship between controls and effects.
Do not copy public-site text panels, explanatory paragraphs or preset labels.
Do not copy its source/art assets without their applicable terms.

A polished result is not a webpage of rounded cards with a simulation inserted.
Avoid large stacked headings, subtitles, step tabs, legends, full-width status
banners and a separate “next/previous” control bar. Keep the main experience within
the intended viewport. No scrolling to find the main action or see the feedback.

## Public Marble visual primitives

Use [marble-ui.css](../assets/marble-ui.css) as a small scoped starting point,
not a ready-made layout. These values come from Marble's child UI design baseline;
scene palettes should suit the subject rather than paint every object brand red.

| Role | Value / treatment |
|---|---|
| Primary accent | `#F42324` red, darker lower lip `#8B0023` |
| Ink | `#141414` |
| Warm surface | `#FDFCFA` |
| Paper/background | `#F4EFE4` |
| Muted | `#626262` |
| Positive feedback | `#1FA20D`, also use shape/motion, not color alone |
| Retry/attention | `#FDAE1C`, with a clear non-color cue |
| Display type | Heavy, rounded, compact; use sparingly for the single title |
| Controls | Rounded/tactile, restrained white rim and shallow depth, clear press/focus/disabled states |

Marble's production Round Medium and Round Condensed Black are commercial faces;
they are not bundled or relicensed here. The skill bundles unmodified **Fredoka**
under the SIL Open Font License as a rounded public substitute, with weights
300–700: [font](../assets/fonts/Fredoka-variable.ttf),
[license](../assets/fonts/OFL.txt), [source](../assets/fonts/SOURCE.md).
Use about 600–700 for the title, 400–500 for the short instruction. Test rendered
metrics and contrast on the actual scene. Do not silently fall back to unrelated
system typography. If authorized production fonts are available in a private
project, they may replace the substitute under their existing terms.

Embed the font bytes as a CSS data URL when producing the final standalone HTML.
Retain the complete font license in the HTML source and adult companion. The
starter CSS refers to a local font file only for development; copying it inline
without replacing that URL is not a standalone deliverable. These third-party
font assets remain under OFL rather than the repository's prose/content license.

## Three.js workflow

For spatial topics, use Three.js. Follow the current
[official installation documentation](https://threejs.org/manual/pages/installation.html).
Install a pinned package release and only the necessary addons in a local
scratch project. A development server and bundler are allowed during authoring;
the **delivered HTML** still requires no build, server or network.

Bundle the used Three.js modules and application code into a single inline script
with a suitable tool such as esbuild or an equivalent bundler. Embed textures,
fonts and required assets; avoid runtime import maps, CDN imports, fetches, remote
fonts and relative asset requests. Preserve third-party notices including
Three.js's MIT license. Smoke-test the final artifact itself via `file://` with
network blocked, not only the development server version. Do not commit generated
experiences or their dependency directories to os-taxonomy unless requested.

Use perspective, materials, lighting, controlled contrast and camera framing with
intent. Ensure educational lighting/occlusion remains accurate even if decorative
fill light is used. Avoid flat, toy-default geometry as a finished visual style.
Polish silhouettes, surface detail and state transitions without hiding the
relationship being taught. Cap device pixel ratio as appropriate, resize correctly,
and avoid a heavy effect stack that makes interaction stutter. A WebGL failure
must not silently fall back to the rejected flat lesson or report mastery; state
the device limitation and an honest alternative.

## Controls belong to the experience

Drag an object to change it; grab a rotation handle; tap a position to place an
observer; drag a prediction token into the scene. Attach the control to the thing
it changes. Prefer these over “turn one step” buttons outside the world.
Constrain drag axes and camera motion to preserve orientation. Use a distinct
visual affordance for movable objects and an immediate response to touch.

Keep supplementary actions as a few scene-adjacent icon controls with accessible
names, generous hit areas (at least 44 CSS px) and clear focus. Decorative 3D
controls still need keyboard-operable semantic equivalents, which can remain
visually integrated. Avoid visible captions/tooltips that become extra text.
Prediction controls must be easy to discover while answer-revealing cues stay
hidden until the response is committed.

## Visual acceptance before delivery

Inspect actual screenshots at the agreed device size and at a narrow layout:

- The scene dominates, with a deliberate focal point and an intelligible first
  action. The composition is not two boxed diagrams surrounded by explanatory UI.
- Only the single title and current instruction are visible. Feedback replaces
  the instruction; no text accumulates across stages. No visible text is hidden
  in canvas labels or tooltips to evade the budget.
- Typography has loaded, whitespace is intentional, the title does not overwhelm
  the world, and controls have consistent depth, hit areas and state treatment.
- The objects, lighting and transitions look finished at full size. No clipped
  geometry, default-debug axes, misplaced rays, accidental overlap or stretched
  textures. Ghosts/halos demonstrate manipulation without adding prose.
- Touch, keyboard, camera transitions, prediction commitment and visual feedback
  all work. The scene does not require reading a manual or precision dragging.

Render the risky scene first, critique it against these criteria, improve it and
render again before expanding. This is a visual review, not just a console-error
check. Retain screenshot evidence and concise observations in development files,
not extra child-facing panels. If the reference or target quality has not been
met, continue iterating or describe the result honestly as an unfinished prototype.
