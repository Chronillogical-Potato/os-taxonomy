# Learning experience examples

Use these four reviewed prototypes to understand the craft and interaction bar.
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

Borrow the relationship between learning action, representation, support and
independent evidence. Do not copy a screen sequence, palette, mascot, fixed
question count or success threshold simply because an example uses it. None of
these examples demonstrates emergent ecosystem dynamics or runtime LLM use.

## What has authority

The current skill and component styling govern new work. Examples are snapshots
of user iterations, with documented exceptions and remaining weaknesses. They
are not universal templates or evidence of effectiveness with a child. In
particular, a two-level header, duplicate feedback toast or realistic effect in
a snapshot does not relax the current one-title/one-instruction budget or
cel-shaded 3D direction. Moon Visit's continuously shaded Earth and Moon are a
documented user-approved exception, not a change to that default. Moon Visit also retains a historical desktop-to-mobile
viewport-transition failure capture; its latest fresh mobile load is readable. Hidden Cubes' mathematical fields are a specifically
agreed exception, not permission to add text panels to another topic.

Topic IDs below describe consulted anchors, not complete curriculum coverage.
Resolve IDs against the current topics and research when designing new work;
labels and prerequisites can change. Some original adult notes describe older
versions, so these curated notes state the narrower evidence and limitations
instead of republishing stale validation claims.

## Opening, source and rebuilding

Each example now starts with its central question on a richly illustrated cover,
then enters the lesson with the smaller title/instruction treatment.
`screenshots/entry.png` and `narrow.png` show that cover; `lesson-entry.png` and
`narrow-lesson.png` preserve the first practice view for comparison. The Moon,
Sky and Cubes sources share [opening.mjs](../examples/opening.mjs) for entry/focus
behavior, while each stages its own artwork; Bee uses its native SVG composition.

Each example has `experience.html` (double-click to run offline), `source/`
(readable application and shell), `design.md`, `screenshots/` and dependency
notices. The WebGL examples require a capable browser; Bee Builder uses SVG.
The four HTML snapshots contain the font and dependencies and require no
installation. No child responses or learner identifiers are included.

For development only, in the skill's `examples/` directory run:

```sh
npm ci
npm run build
# Or rebuild only one:
npm run build -- hidden-cubes
```

The pinned development dependencies are Three.js 0.180.0 and esbuild 0.27.7.
The build embeds the skill's font/CSS and writes `dist/<example>.html`, leaving
reviewed snapshots untouched. Open that output and validate it after editing;
a successful build alone is not a UX review. Source imports were normalized
from local scratch paths to npm package imports. `snapshot.json` records source
and HTML hashes for the imported revision, including the shared opening module. Generated `dist/` and dependencies
are excluded from version control.

Marble-authored example material is shared under the repository's
[content license](../../../../LICENSE-CONTENT). Retain attribution and the
separate Three.js MIT and Baloo 2 OFL notices when reusing bundled material.
Bee Builder also retains the anidoodle Marker Comic style reference and its
Apache 2.0 license/NOTICE; its original SVG art does not bundle the anidoodle engine.
External research links support the teaching rationale; they are not licenses
to copy those sources' text or artwork.
