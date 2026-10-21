# Design the interaction and the evidence together

## Start from a learning action

For the main loop, identify what the child sees, the decision or manipulation
they make, the consequence revealed, and the insight that consequence supports.
Keep the meaningful representation prominent and controls close to what they
change. Show one clear next action; introduce controls and complexity gradually.
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

## Vocabulary is available where it is used

Inventory the technical vocabulary in all child-visible copy, including the
cover, changing instructions and feedback, controls, mathematical labels and
optional extension. Mark each occurrence with a dashed underline. Handle
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

A word in a button or form label still needs help. Avoid nested buttons: term
activation must not choose a shape, submit a prediction or focus/edit a field.
The surrounding action remains available, and its keyboard focus should expose
word help without changing its action. Preserve accessible names, description
associations, sensible focus order and the cover's isolation from lesson controls.

Looking up incidental language does not change response evidence. Definitions
must not contain the current answer, numerical result, hint or a model-specific
claim that gives it away. If knowing the word's meaning is itself the agreed
independent assessment target, opening its definition is support; record that
honestly or offer a fresh unassisted task. This is the same distinction between
language access and answer-revealing help used in the teaching design.

The examples share [vocabulary.js](../examples/vocabulary.js); inspect its scoped
lexicon and event handling when adapting it. Review the new topic's definitions
rather than treating that example lexicon as complete for every experience.

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
Avoid free camera navigation unless it is part of the learning goal.

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
