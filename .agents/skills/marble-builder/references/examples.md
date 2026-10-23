# Learning experience examples

Use these five reviewed prototypes to understand the craft and interaction bar.
Read the closest design note before proposing a new concept; inspect its images
when image tools are available. After concept approval, open the relevant HTML
and read only the source needed for the interaction you plan to adapt. Do not
load minified HTML into model context: use `source/` instead.

| Example | Use it for | Design note |
|---|---|---|
| Moon Visit | Changing viewpoint while preserving a spatial model; causal light-path construction | [Moon Visit](../examples/moon-visit/design.md) |
| Sky Colour Explorer | Revealing an invisible mechanism; connecting model and observer views | [Sky Colour Explorer](../examples/sky-colour-explorer/design.md) |
| Hidden Cubes | Building composite units; revealing hidden structure; checking a learner's plan | [Hidden Cubes](../examples/hidden-cubes/design.md) |
| Bee Builder | Deliberate 2D geometry; comparing equal areas and boundaries; construction transfer | [Bee Builder](../examples/bee-builder/design.md) |
| Otter Forest | Nonlinear investigations and free exploration; emergent ecosystem dynamics, sustained goals and matched-time comparisons | [Otter Forest](../examples/otter-forest/design.md) |

Borrow the relationship between learning action, representation, support and
independent evidence. Do not copy a screen sequence, palette, mascot, fixed
question count or success threshold simply because an example uses it. Otter
Forest adds a qualitative agent simulation, not a calibrated ecological forecast. None of these examples demonstrates runtime LLM use.

## What has authority

The current skill and component styling govern new work. Examples are snapshots
of design iterations, with documented exceptions and remaining weaknesses. They
are not universal templates or evidence of effectiveness with a child. In
particular, a two-level header, duplicate feedback toast or realistic effect in
a snapshot does not relax the current one-title/one-instruction budget or
cel-shaded 3D direction. Moon Visit's continuously shaded Earth and Moon are a
documented user-approved exception, not a change to that default. Moon Visit also retains a historical desktop-to-mobile
viewport-transition failure capture; its latest fresh mobile load is readable. Hidden Cubes' mathematical fields are a specifically
agreed exception, not permission to add text panels to another topic. Otter
Forest exposes goal requirements and a stability timer as task-specific
simulation UI; they are not a default explanatory-text layout.

Topic IDs below describe consulted anchors, not complete curriculum coverage.
Resolve IDs against the current topics and research when designing new work;
labels and prerequisites can change. Some original adult notes describe older
versions, so these curated notes state the narrower evidence and limitations
instead of republishing stale validation claims.

## Opening, source and rebuilding

Each example now starts with its central question on a richly illustrated cover,
then enters the lesson with the smaller title/instruction treatment.
`screenshots/entry.png` and `narrow.png` show that cover; `lesson-entry.png` and
`narrow-lesson.png` preserve practice views for comparison (Otter’s phone
capture shows its first challenge). The Moon,
Sky and Cubes sources share [opening.mjs](../examples/opening.mjs) for entry/focus
behavior, while each stages its own artwork; Bee uses its native SVG composition.
Otter stages its own underwater 3D cover and entry flow.

The original four examples share [vocabulary.js](../examples/vocabulary.js): a scoped
lexicon, dashed inline affordances and one hover/tap/keyboard word-help region.
Otter uses a [scoped ecology version](../examples/otter-forest/source/vocabulary.js)
with the same exclusion for action controls, including organism tray buttons.
Each design note links its actual desktop/phone vocabulary captures. Review and
adapt the definitions for a new topic and learner; the helper is a reference,
not a universal dictionary or a task-specific hint system. Both helpers exclude
buttons and other action controls and their labels. Historical vocabulary captures
may show underlined control labels; those affordances have been removed from the
current HTML and sources.

Each example has `experience.html` (double-click to run offline), `source/`
(readable application and shell), `design.md`, `screenshots/` and dependency
notices. The WebGL examples require a capable browser; Bee Builder uses SVG.
The five HTML snapshots contain the font and dependencies and require no
installation. No child responses or learner identifiers are included.

For development only, in the skill's `examples/` directory run:

```sh
npm ci
npm run build
# Or rebuild only one:
npm run build -- hidden-cubes
```

The pinned development dependencies are Three.js 0.180.0, esbuild 0.27.7 and
Playwright 1.64.1. Run `npm test` for vocabulary matching and the repeatable
control/definition regression checks with:

```sh
npx playwright install chromium
npm run test:browser
```

The browser checks exercise both vocabulary helpers with mouse and touch,
nested and dynamic controls, button actions and lesson-text definitions.
To use an existing Chromium installation, set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable path.
The build embeds the skill's font/CSS and writes `dist/<example>.html`, leaving
reviewed snapshots untouched. Open that output and validate it after editing;
a successful build alone is not a UX review. Source imports were normalized
from local scratch paths to npm package imports. `snapshot.json` records source
and HTML hashes for the imported revision, including the shared opening and vocabulary modules. Generated `dist/` and dependencies
are excluded from version control.

Marble-authored example material is shared under the repository's
[content license](../../../../LICENSE-CONTENT). Retain attribution and the
separate Three.js MIT and Baloo 2 OFL notices when reusing bundled material.
Bee Builder also retains the anidoodle Marker Comic style reference and its
Apache 2.0 license/NOTICE; its original SVG art does not bundle the anidoodle engine.
External research links support the teaching rationale; they are not licenses
to copy those sources' text or artwork.

## Localising the shared helpers

Before loading `examples/vocabulary.js`, set `window.learningVocabularyOptions`
to supply a replacement lexicon and translated accessible labels. Omitted fields
retain their English defaults; an empty `entries` array disables annotation.
Aliases match case-insensitively with Unicode letter/mark boundaries, canonical
accent forms and either straight or curly apostrophes. The visible text is preserved.

```js
window.learningVocabularyOptions = {
  entries: [
    ['gravity', ['gravité'], 'Une attraction entre les objets qui ont une masse.'],
    ['air-resistance', ["résistance de l’air"], 'Une force de l’air qui freine un objet en mouvement.']
  ],
  strings: {
    regionLabel: 'Définition',
    explain: word => `Expliquer « ${word} »`,
    closeLabel: 'Fermer la définition'
  }
};
```

Pass `startLabel` to `createOpening` for the translated start action, for example
`startLabel: 'Découvrons-le'`. Its default remains “Let’s find out”. Supply strings
as plain text; `explain` is a function so each language can place the term naturally.
