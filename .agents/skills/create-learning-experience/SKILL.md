---
name: create-learning-experience
description: Design a learning experience for a child with the user, ground it in os-taxonomy and teaching research, then build and validate a standalone HTML experience. Use for creating or revising child-facing learning activities, rather than general curriculum lookup.
---

# Create a learning experience

Turn a user-confirmed learning goal into an educationally sound, standalone HTML
experience through a short design conversation. Use this repository's topics,
prerequisites and teaching research; develop targeted research when it is missing
or insufficient. Design the interaction and its assessment together, then render,
inspect and revise the experience in a browser. A working HTML file is an initial
prototype, not sufficient evidence of a good learning experience.

## Establish just enough context

Use information already available in the conversation. Before designing, obtain:

- The child's age, if unknown. Do not require a name, birthday or other identifiers.
- A clear learning goal provided or confirmed by the user. Help turn a broad
  request such as “fractions” into an observable goal, without silently choosing
  the goal for them.

Ask only additional questions whose answers would materially change the design.
Prior knowledge, reading independence, access needs, interests, available time,
adult support and device may matter; they are not a mandatory questionnaire.
Bundle necessary questions into one short turn. For other details, make reasonable
assumptions and disclose the consequential ones in the concept. Do not infer
mastery or reading ability from age alone. A brief entry task can help calibrate
prerequisites when the adult does not know the child's starting point.

## Ground the design

Read [data-and-research.md](references/data-and-research.md) to locate this
repository's data, join topic research and interpret its limitations. Select a
small scope matched to the confirmed goal, using topic evidence and prerequisite
edges to identify the intended outcome and likely starting requirements. Age
bands guide selection; they do not override known readiness.

Use existing pedagogy, activity guidance, constraints, misconceptions, assessment
and sources to inform the experience. Check that they fit this goal and child;
resolve contradictions and verify consequential factual claims. Existing
activities are proposals to adapt, not a script or evidence of effectiveness.
Do not display publication omission markers as instructional content.

For a missing or inadequate research record, prepare a focused teaching brief:

- The learning objective and prerequisites.
- Suitable representations, instructional approach and scaffold progression.
- Likely misconceptions, feedback and a plan to assess independent understanding.
- Supporting sources and important uncertainty, distinguishing findings from
  your own proposed design.

Use available web/research tools to inspect relevant primary research, evidence
syntheses or authoritative teaching guidance. Record what each source actually
supports; a curriculum standard establishes alignment rather than efficacy.
Never invent references or imply that an unread source was checked. If source
access is unavailable, disclose it and label the brief provisional; ask about
alternatives only if that limitation prevents a sound design. Keep personal child
context out of research queries and reusable research artifacts.

When this new research would help an existing taxonomy topic, suggest an optional
os-taxonomy contribution. Follow the contribution guidance in the reference only
if the user wants to pursue it. Continue the learning experience independently.
Creating an experience does not authorize publishing research or child context.

## Develop the concept with the user

Read [interaction-design.md](references/interaction-design.md) and
[visual-design.md](references/visual-design.md) before proposing the concept. Design what the child will see
and do, and what that action will reveal about understanding. Before building the full HTML, present a compact,
concrete proposal containing:

- The observable learning goal and selected topic(s).
- The central visual/interactive activity, with an example interaction or short
  screen sequence. Explain the representation choice, viewpoint and controls;
  check that they preserve the relationships the child needs to understand.
- How the activity teaches the idea, including the important research basis and
  any significant uncertainty.
- How support will be introduced, adjusted and faded.
- An independent task the interface can assess: the child's action, the observable
  response, the scoring rule and a plausible misconception it distinguishes.
  Prefer a prediction on a fresh transfer problem when it fits the goal. Explain
  what changes from practice and how the answer stays hidden until commitment.
- Expected duration, device/adult-support assumptions and optional extension.

Invite refinement and wait for the user to confirm the direction before full
implementation. This concept checkpoint is required by this workflow; do not
one-shot a completed experience from the initial request. If the user already
provided an approved concept, validate any missing essentials without repeating
an approval ceremony. A small sketch may help the decision, but is not the full
experience. After agreement, make routine implementation decisions autonomously.

## Build the experience

Deliver one HTML file with embedded CSS, JavaScript and required assets. It must
open directly in a browser without accounts, a build step, a server or network
access. Keep any research/design companion outside the child-facing flow. Use
local interactions and no tracking or transmission of child responses by default.
Use the bundled **Baloo 2** throughout: 800 for ALL CAPS titles, 500 for the
current instruction/explanation, and 600 for button labels. Embed the actual font
bytes; do not substitute another family or rely on a fallback without the user's
agreement. Keep instructions and button labels in sentence case.
Use Three.js for spatial experiences involving viewpoint, illumination, depth,
occlusion or moving physical objects, including the daytime-Moon example. Build
one coherent, polished 3D scene with direct manipulation: drag the Earth, place an
observer, or select a prediction in the scene. All 3D uses a crafted cel-shaded
look: flat color, deliberate stepped light/shadow bands and clean black outlines.
Visual simulations must be beautiful, crafted and polished as well as functional;
a working model with placeholder art is not a finished experience.
Do not substitute flat comparison
panels and external step buttons for spatial interaction. Use 2D for goals whose
reasoning is genuinely two-dimensional, such as fraction bars or sentence work.
Follow [visual-design.md](references/visual-design.md) for Marble-derived fonts,
colors, tactile controls, scene composition and the standalone Three.js workflow.
Respect explicit user constraints.

Design a coherent learning sequence rather than a collection of screens:

- Start with an approachable task and a clear purpose. Teach the idea through
  meaningful actions or representations, not decoration around a quiz.
- Let the child learn through looking, acting, predicting and seeing consequences.
  Keep the title small, ALL CAPS and anchored at the top left; keep instructions
  and button labels in sentence case.
  Make the current instruction
  or short explanation large, prominent and part of the experience's composition;
  it is the main text, not a caption beneath a dominant heading.
  The child-facing experience may show only **one title and one short instruction
  at a time**. Use that same instruction slot for feedback; replace it rather than
  appending explanation. No subtitles, legends, visible object labels, status
  paragraphs or textual tabs. Buttons should combine an icon with a concise
  visible action label; these functional labels are allowed alongside the title
  and instruction. Reserve icon-only buttons for a good reason, such as a small
  action bar or an unmistakable scene affordance, and give them accessible names.
  Do not turn button labels into additional instructions or explanations.
  Keep adult notes and credits in
  a separate companion. For a goal that genuinely requires visible reading
  material or mathematical notation, resolve that conflict explicitly with the user during concept design
  rather than silently relaxing this rule.
- Make feedback visual first: reveal the relevant consequence or relationship,
  connect errors to likely misconceptions and offer a useful retry. A short
  replacement instruction can direct attention; do not add a feedback card.
- Offer support when needed, then fade it toward independent practice. Avoid
  overwhelming reading demands or requiring an adult unless agreed.
- Separate supported practice from the independent mastery check. Choose evidence
  suited to the goal: explanation, construction, performance or interpretation
  may reveal more than recognition alone.
- Define success using the concept's agreed evidence; no universal percentage or
  item count. Completion, hinted answers and repeated guessing do not by
  themselves demonstrate mastery. Build assessable actions into the core UI;
  design around an observable response rather than defaulting to “ask a parent
  to judge.” If the goal requires evidence the browser genuinely cannot assess,
  propose a suitable alternative or explicitly agree adult assessment during
  concept design. Never claim to assess the whole goal from a narrower proxy.
- When evidence is insufficient, replace the current instruction with “needs more
  practice” or “not yet checked” and offer targeted support through the scene;
  never add a separate result/status label. Describe the result as evidence from this session,
  rather than a lasting diagnosis or proof of retained mastery.
- Include optional “going further” content that deepens or transfers the idea;
  it must not be required to finish the core goal.

Provide basic keyboard operation, readable contrast, responsive layout and
non-colour-only feedback. Offer a practical alternative to any essential
interaction that requires precise dragging, sound or similar capabilities.
Keep progress, hints, retries and restart behavior understandable using scene
state, icons and non-text progress marks. Put source acknowledgements and required
attribution in the separate adult companion and retain embedded asset license
notices in the HTML source; follow the repository's README and provenance notices
for reused material. Do not turn the learning canvas into a branded webpage.

## Validate and hand over

Use [validation.md](references/validation.md) during development, starting with
the central interaction before polishing the rest. Render in a browser, inspect
screenshots and exercise controls, revise the design, then render and check the
revision. Assess visual clarity and teaching behavior as well as correct code;
a screenshot captured but not inspected is not a UX review. Compare the rendered
composition with the Water Lab reference and the explicit visual acceptance
criteria; “it loads” is not a polish pass. Use browser tools
available in the environment, without requiring a particular automation stack.
If browser access is unavailable, report the artifact as a prototype awaiting
browser validation rather than presenting the UX as validated. Automated checks
cannot establish effectiveness for a particular child.

Deliver the HTML and a short adult-facing note covering the goal, topic IDs,
prerequisites/assumptions, research used or newly developed, mastery evidence,
optional extension and any remaining limitations. Include a way to open the file
and summarize what was actually tested. Do not claim browser or child testing
that did not happen. Invite observations from actual use to guide the next
revision; do not turn that invitation into a required extra questionnaire.
