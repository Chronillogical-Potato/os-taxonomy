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
manipulation reference, not a ready-made mastery assessment. It sets the bar for
craft and polish; its glossy/realistic materials are not the required rendering
style. New 3D experiences use the cel-shaded direction below.

Use its rendered experience as a composition and interaction reference, not its
entire text content as a template. The required text budget here is stricter:
During the lesson, **one title and one instruction visible at a time**, plus concise functional
button labels. These labels identify actions, not extra teaching prose.
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

## Question-led illustrated opening

Every experience starts with a cover that makes its central question inviting
and clear. The approved [Bee Builder example](../examples/bee-builder/design.md)
shows the approach: a large “Why do bees use hexagons?” beside a crafted close-up
honeycomb, botanical framing and the original bumblebee, with one “Let’s find out”
button. Use artwork and a question specific to the new topic rather than copying
that motif or adding a generic welcome page.

The cover is a composed illustration, not an empty splash screen with a title
floating over the normal lesson UI. Reuse the experience's actual visual assets
or a deliberately staged 3D view when appropriate. Keep the focal objects clear
of the question and start action; deliberate decorative cropping is acceptable.
On a wide screen, question and artwork can sit side by side; on a phone, recompose
rather than shrink the desktop layout. Check short viewports as well as phones.
One large question heading and one icon-plus-label start button are enough:
no subtitle, explanatory paragraph, navigation tabs, progress or lesson controls.
The cover may use a large 550-weight heading; this is a scoped exception to the
small-title lesson styling, not a replacement for it.

The start action enters a fresh lesson and moves keyboard focus to its first
useful control. While the cover is open, underlying controls must be invisible,
untabbable and unavailable to touch; hide/inert the real elements rather than
only covering them with artwork. Preview motion respects reduced motion.
The cover is not practice or assessment and cannot change response evidence.
Restart clears responses, assistance and reveals, and returns to this opening.
Never use the actual independent task's answer as decorative cover artwork.

## Technical-word affordances

Use the [inline vocabulary treatment](component-styling.md#inline-word-meanings)
wherever child-visible copy uses technical terms, including the question cover.
A dashed underline exposes a short contextual meaning on hover, tap or keyboard
focus/activation. The one-at-a-time temporary explanation is an approved exception
to the lesson's one-instruction budget; keep the default scene free of persistent
word-help panels. See [interaction-design.md](interaction-design.md#vocabulary-is-available-where-it-is-used)
for dismissal, action isolation and assessment boundaries.

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
| Title | Small, compact, anchored top left; secondary to the experience |
| Instruction / explanation | Large, prominent text composed with the scene; the primary text role |
| Controls | White surface, dark 2px outline, 4px lower edge; red reserved for primary actions |

The approved font is **Baloo 2**, used consistently across the experience. The
skill bundles the unmodified variable font, weights 400–800, under SIL OFL:
[font](../assets/fonts/Baloo2-variable.ttf),
[license](../assets/fonts/OFL.txt), [pinned source](../assets/fonts/SOURCE.md).
Use the [Marble component styling](component-styling.md): **500 / sentence
case for the small title**, **550 / sentence case for the prominent instruction
or explanation**, and **500 / sentence case for button labels**. These house-style roles govern typography and controls, including the title casing.
Do not introduce another family or use system typography as the finished result.
Verify the embedded Baloo 2 actually loads; a CSS declaration alone is insufficient.

Marble's commercial Round faces informed the comparison but are not bundled or
required. Replacing or mixing font families requires an explicit project-level
exception to the house style.

Use the measurements, explanation accent rule, scene-aware placement and
responsive behavior in [component-styling.md](component-styling.md). Keep the
explanatory text prominent within the scene and away from the object being
explored. Feedback or explanation replaces the same text slot; it does not add
a second block. Test rendered metrics and contrast on the actual scene.

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
the **delivered HTML** still requires no build, server or network by default.
Author-approved [connected LLM mode](llm-connected-experiences.md) permits its
declared inference connection; it does not permit remote visual dependencies.

Bundle the used Three.js modules and application code into a single inline script
with a suitable tool such as esbuild or an equivalent bundler. Embed textures,
fonts and required assets; avoid runtime import maps, CDN imports, asset fetches, remote
fonts and relative asset requests. Preserve third-party notices including
Three.js's MIT license. Smoke-test the final artifact itself via `file://` with
network blocked, not only the development server version. For approved connected
mode, check local rendering with the network blocked and separately exercise the
declared connection and its failure states through the agreed launch path. Do not
commit generated experiences or their dependency directories to os-taxonomy unless requested.

## Crafted cel-shaded 3D

All 3D experiences use a crafted cel-shaded look: flat colors, intentional stepped
light/shadow bands and clean black outlines. Aim for a beautifully composed,
illustrated world with depth, not a generic technical demo or glossy realism.
Use a restrained, harmonious palette with clear silhouettes and visual hierarchy.
“Flat color” means controlled color regions, not flattening the spatial model or
removing the light relationships that carry the lesson.

Choose outline weight deliberately for the intended viewport: strong enough to
read, restrained enough to preserve small features. Keep outlines coherent on
curved forms, overlapping objects and moving silhouettes, without halos, jagged
edges, distracting internal seams or flicker. Check the result while objects and
the camera move, not just in a flattering still. Match outline treatment across
the scene; a CSS border around the canvas does not supply object outlines.

Use geometry, proportions, perspective, lighting and framing with intent. Shape
silhouettes and arrange objects as a crafted composition rather than leaving
unconsidered primitives in default positions. Preserve educational illumination
and occlusion: cel shading must not invent lit regions or hide a relationship the
child needs to infer. Use tasteful motion and polished transitions to reinforce
action and consequence, with reduced-motion support.

Beauty, craft and polish are requirements for every visual simulation, including
2D. Functional correctness is necessary but does not establish visual quality.
Inspect composition, palette, silhouettes, typography, controls, motion and feedback
as a whole. If they look like placeholder art or an engineering proof of concept,
keep iterating; do not call it finished because the simulation works.

Cap device pixel ratio as appropriate, resize correctly, and avoid a heavy effect
stack that makes interaction stutter. A WebGL failure must not silently fall back
to the rejected flat lesson or report mastery; state the device limitation and an
honest alternative.

## Controls belong to the experience

Drag an object to change it; grab a rotation handle; tap a position to place an
observer; drag a prediction token into the scene. Attach the control to the thing
it changes. Prefer these over “turn one step” buttons outside the world.
Constrain drag axes and camera motion to preserve orientation. Use a distinct
visual affordance for movable objects and an immediate response to touch.

Buttons should pair an icon with a concise visible action label by default, such
as a replay icon with “Try again”. Choose icons that reinforce the action; do not
use an ambiguous symbol alone when a label would clarify it. Keep labels short
and keep them inside the button. Functional button labels are exempt from the
single-title/single-instruction limit; explanatory button captions are not.

Use icon-only controls where there is a good reason, such as a compact action bar,
a familiar close control or an unmistakable in-scene affordance. Give them
accessible names. Keep supplementary actions scene-adjacent, with generous hit
areas (at least 44 CSS px) and clear focus. Decorative 3D controls still need
keyboard-operable semantic equivalents, which can remain visually integrated.
Do not add explanatory tooltips or captions to evade the text budget.
Prediction controls must be easy to discover while answer-revealing cues stay
hidden until the response is committed.

## Visual acceptance before delivery

Inspect actual screenshots at the agreed device size and at a narrow layout:

- The opening has a large central question, topic-specific crafted artwork and
  one start action; lesson controls stay hidden and untabbable until entry.
- During the lesson, the scene dominates, with a deliberate focal point and an intelligible first
  action. The composition is not two boxed diagrams surrounded by explanatory UI.
- During the lesson, only the single title, current instruction and concise functional button labels
  are visible. Feedback replaces the instruction; no text accumulates across
  stages. Buttons have icons and labels unless an icon-only exception is justified.
  No additional visible text is hidden
  in canvas labels or tooltips to evade the budget.
- Typography has loaded and whitespace is intentional. The lesson title is small at the
  top left in sentence-case Baloo 2 at weight 500; explanations use 550 and
  button labels use 500. The current instruction/explanation is conspicuously larger and
  prominent within the experience. Controls have consistent depth, hit areas and
  state treatment. Long text must not silently shrink to caption size.
- 3D uses flat color, deliberate cel-shaded light/shadow bands and clean black
  object outlines. Line weight stays readable and stable through movement and
  viewport changes; the result does not drift into glossy realism or default
  materials. Stylization preserves the educational relationships.
- The simulation meets the beauty/craft/polish bar as a composed experience, not
  only a functional model. The objects, lighting and transitions look finished
  at full size. No clipped
  geometry, default-debug axes, misplaced rays, accidental overlap or stretched
  textures. Ghosts/halos demonstrate manipulation without adding prose.
- Touch, keyboard, camera transitions, prediction commitment and visual feedback
  all work. The scene does not require reading a manual or precision dragging.

Render the risky scene first, critique it against these criteria, improve it and
render again before expanding. This is a visual review, not just a console-error
check. Retain screenshot evidence and concise observations in development files,
not extra child-facing panels. If the reference or target quality has not been
met, continue iterating or describe the result honestly as an unfinished prototype.
