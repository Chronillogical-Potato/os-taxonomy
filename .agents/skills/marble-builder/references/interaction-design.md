# Design the interaction and the evidence together

## Start from a learning action

For the main loop, identify what the child sees, the decision or manipulation
they make, the consequence revealed, and the insight that consequence supports.
Keep the meaningful representation prominent and controls close to what they
change. Keep the immediate action or choice clear; introduce controls and
complexity gradually.
A long explanation followed by a quiz is not a substitute for this design work.

Begin with a richly illustrated cover posing the central question and one start
action. The cover introduces the investigation; it earns no assessment credit.
Starting enters fresh practice and restart returns to the cover with cleared
evidence. During the lesson, show only one title and one short instruction. Feedback replaces
that instruction. Teach through the scene, motion and consequences, not appended
copy. Buttons use both an icon and a short action label by default; their labels
are allowed alongside the title and instruction. Use icon-only controls when a
compact action bar or another clear design reason warrants it, with accessible
names. Keep adult explanations elsewhere.
If the goal requires reading material or mathematical notation, agree the narrow
exception for task text with
the user before building. Read [visual-design.md](visual-design.md) for the visual
reference, fonts, control treatment and polish criteria.

## Choose the learning flow deliberately

Do not assume every experience is a tutorial followed by a quiz and a finish
screen. Choose a guided sequence, a set of investigations, a manipulable sandbox
or a combination according to the learning goal. A short guided introduction can
establish essential relationships and controls before opening up learner choice.
Use a required order only where an actual prerequisite justifies it; a suggested
route can orient learners without locking every other activity.

Make choices educationally distinct: investigate a different relationship,
change a condition, revisit an unresolved question or explore freely. A menu
whose only usable option is always “Next” does not create meaningful agency.
Keep navigation concise and suited to the device; branching does not require
persistent tabs, extra headings or a dashboard.

Let learners leave and return without accidentally losing their experiment or
response evidence. Distinguish resume, replay of an investigation and a full
restart; make the scope of any reset understandable. Revisiting an answer or
switching branches must not clear its support/reveal history and make it appear
independent. Gate only the evidence that requires an independent attempt, not
unrelated exploration. Exploration itself can remain unscored.

[Otter Forest](../examples/otter-forest/design.md) is the reference for a guided
introduction opening into selectable investigations, saved in-session worlds,
replay and free exploration. Borrow that structure when it fits; do not impose
its number of challenges or require a menu for every experience. For experiments
whose outcomes unfold over time, read [simulation-design.md](simulation-design.md).

## Reveal relationships through visual transformations

Use transformations that make the reasoning inspectable: follow one event before
showing many, open a solid into layers, unfold boundaries onto a shared scale,
or move from a world overview to an observer's view. Preserve object identity
and the quantities that matter through the transition. Offer replay, pause or
stepping when a transient event carries the explanation; essential information
must also remain understandable with reduced motion.

For comparisons, make the controlled quantities explicit in the representation.
Bee Builder holds area constant when comparing boundaries; different scales or
uncontrolled size changes would undermine that comparison. Decorative ink,
shading and oversized hit targets must not distort mathematical boundaries or
make unrelated objects selectable.

## Vocabulary is available where it is used

Inventory the technical vocabulary in all child-visible copy, including the
cover, changing instructions and feedback, controls, mathematical labels and
optional extension. Mark occurrences in non-interactive text with a dashed
underline; exclude buttons and other action controls and their labels. Handle
plurals/capitalization and meaningful phrases such as “cubic unit” together.
Use the word itself as the trigger; an extra icon is unnecessary here. For a
canvas/3D label, provide an equivalent underlined, keyboard-accessible overlay
rather than baking an unreachable technical word into the artwork.

Hover on desktop, tap on mobile and keyboard focus/activation reveal the same
short meaning. Keep only one explanation open; let the pointer move into it
without dismissing it, and provide close, Escape and outside-tap dismissal.
Position it near the term within the viewport. Close stale explanations when
the term disappears or its scene is hidden. Do not rely on native title tooltips,
hover alone or a remote dictionary. Definitions use plain language suited to the
learner and context, explaining unfamiliar words without a chain of new jargon.

Never put definition triggers or dashed vocabulary underlines inside native or
ARIA buttons, links, disclosure controls or form labels. The entire control,
including its words, must perform its action with click, tap, Enter or Space as
appropriate; hovering or focusing it must not open word help. Explain unfamiliar
control vocabulary in the current instruction or other non-interactive text.
Preserve accessible names, sensible focus order and the cover's isolation from
lesson controls.

Looking up incidental language does not change response evidence. Definitions
must not contain the current answer, numerical result, hint or a model-specific
claim that gives it away. If knowing the word's meaning is itself the agreed
independent assessment target, opening its definition is support; record that
honestly or offer a fresh unassisted task. This is the same distinction between
language access and answer-revealing help used in the teaching design.

The examples share [vocabulary.js](../examples/vocabulary.js); inspect its scoped
lexicon and event handling when adapting it. Review the new topic's definitions
rather than treating that example lexicon as complete for every experience.
Keep interactive word wrapping outside live announcement regions; announce
changed instructions once as plain text through a separate accessible region.

## Spatial experiences use Three.js

For spatial causal reasoning, use a coherent Three.js world. In the daytime-Moon
case, place Earth, its observer, light and Moon in a shared 3D model with deliberate
lighting and clear viewpoints. Put the main interaction on the objects: drag the
Earth to rotate it, pick/place an observer, and transition to their view when it
serves the task. Use constrained gestures and guided camera transitions so the
child manipulates the concept rather than struggles with a 3D editor.

A pair of flat explanatory diagrams with side buttons does not meet this bar.
A secondary view may be needed pedagogically, but introduce it deliberately
rather than defaulting to a dashboard. Maintain context through an animated
camera transition, spatial marker or tightly linked inset, without adding labels
and legends to explain a confusing composition. For genuinely two-dimensional
reasoning, retain 2D: fraction bars need not become a 3D spectacle.

Use picking/raycasting and large invisible hit areas to attach interaction to
objects. Show affordances with a subtle halo, handle, motion cue or ghost state;
never depend on a written control manual. Preserve keyboard alternatives and
accessible semantic controls without building an unrelated side control panel.
Allow bounded orbit/zoom when it helps inspection, with a reliable reset and
keyboard alternatives. Keep guided views where orientation matters. Distinguish
camera gestures from object edits: a drag, pinch or cancelled gesture must not
become a tap that removes an object or commits an answer.

Separate the underlying model from its visual projection and answer checking.
Render practice and assessment from consistent state. Changing the camera must
not accidentally change the physical scenario; changing the scenario must
update all linked views. Check key states and boundaries against the subject
matter. Document consequential simplifications in the adult companion; design
the scene so it does not rely on extra labels to correct a misleading model. Do not let an
oversimplified model teach a false rule.

## Make assessment part of the interaction

Design the independent evidence before building the teaching sequence. For each
core outcome, specify:

| Question | Concrete design decision |
|---|---|
| What must the child infer or do? | Predict an outcome, construct a configuration, order events, locate something or classify a meaningful example. |
| What is observed? | A committed choice, placement, configuration or sequence the UI can check. |
| What makes it correct? | A subject-grounded rule and tolerance, with ambiguous cases handled explicitly. |
| What misconception would produce a different response? | Use it to select informative cases and targeted feedback. |
| What prevents copying or guessing from counting as understanding? | Fresh cases, hidden outcomes, varied response positions and independent attempts as appropriate. |

A useful pattern is **predict → commit → reveal → compare**. Teach with supported
examples, then change a relevant condition and ask the child to predict before
running the model or revealing the outcome. The new case should require applying
the same idea rather than introducing an untaught rule. A cosmetic reskin of an
identical question does not establish transfer; nor does an arbitrary difficulty
jump. Predictions can be visual placements or constructions as well as choices.

For a spatial lesson, a fresh configuration might require predicting what an
observer would see; keep any view that directly exposes the answer hidden until
commitment. Use the resulting views to explain why the prediction did or did
not work. A prediction is only a useful assessment if it measures the intended
concept; inspect whether the child can answer from a visual cue without reasoning.

Score the committed response before revealing feedback. Keep first independent
responses separate from assisted retries. Use several discriminating observations
when one answer could easily be luck, without imposing a universal question
count or percentage. After revealing a solution or hint, use a new case to obtain
new independent evidence rather than awarding mastery for repeating the answer.

When the goal includes a method or causal mechanism, check that as well as the
outcome: a correct total can coexist with an incorrect layer plan; predicting
visibility differs from constructing its light path. Use complementary evidence
where needed without adding a second task by default. Define freshness by the
underlying problem, not cosmetic changes: rotated versions of an already-seen
solid are equivalent when orientation is irrelevant. Bound incidental demands
such as arithmetic so they do not displace the target reasoning.

Default to an experience that can assess the core goal without parent scoring.
Do not quietly replace the core check with an open explanation and an adult
rubric. If authentic performance cannot be assessed locally, discuss the evidence
limit and alternatives in the concept. Optional adult discussion can enrich the
experience without being its main grading mechanism.

## Prototype the risky interaction first

Identify the part most likely to fail educationally or visually: the spatial
view, the manipulation, feedback, or the transfer check. After concept agreement,
build that slice first and render it before expanding the lesson. Compare the
rendered result with the intended learning action. Revise unclear viewpoints,
clutter, unnecessary reading, poor controls or weak evidence before polishing
additional screens. Continue browser inspection after integrating the full flow.
