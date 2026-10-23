# Validate the learning experience

Use the agreed concept and learning goal as the acceptance criteria. Match the
checks to the actual interaction; avoid building a testing framework for a
single HTML file.

## Educational checks

- Trace each core activity to the intended insight and each mastery task to the
  agreed evidence. Check the representations, units, computations, explanations
  and answer keys, including relevant exceptions and counterexamples.
- Try a plausible misconception. Does feedback explain the issue and offer a
  helpful next move? Can a child reach “mastered” by guessing, exhausting retries,
  revealing hints or clicking through without demonstrating the goal?
- Read each instruction and prompt alongside its answer options. Remove wording
  that primes an answer, such as “dropped together” when “Together” is a choice;
  describe the setup neutrally without revealing the assessed relationship.
- Check scaffolds can help a struggling learner and that the final independent
  evidence does not depend on revealed answers. Assisted success should remain
  distinct from independent success. Fresh tasks must stay within taught scope.
- For explanations, drawing, construction or physical tasks, check whether the
  program can assess the evidence honestly. Check that the core UI captures the
  agreed evidence and the check was not silently delegated to a parent. If adult
  assessment was explicitly agreed, keep that limit visible and do not mark an
  unreviewed response as mastered.
- Check optional extension, reading demands and adult involvement fit the concept.
  Avoid describing a short session result as long-term retention or transfer
  beyond what the child actually demonstrated.

- Check the child's language across the cover, instructions, feedback, buttons,
  accessible labels and definitions, including dynamic states and helper defaults.
  Check the adult note uses the same language unless another was requested,
  `<html lang>` is correct, and casing and typography follow the chosen locale.
  At narrow widths, French punctuation must stay attached with the appropriate
  no-break spaces rather than wrapping alone.

## Browser iteration

Render early, inspect, revise and render again. Start with the risky interaction,
then check the integrated experience. Use available browser automation or manual
browser tools; inspecting source or the DOM alone does not validate presentation.

The desktop app's built-in browser has been observed to throttle
`requestAnimationFrame` while its pane is hidden: animations can appear frozen,
screenshots can be stale, and scripts waiting for frames can time out. It also
refuses `file://` URLs. Treat these as tool-specific limitations; check the
current tool's behaviour rather than diagnosing a simulation bug from a timeout.
Keep the pane visible during live animation checks and wait for a fresh render
before capturing a screenshot.

Serve the built HTML from a local static server for those checks, for example
`python3 -m http.server 8000 --bind 127.0.0.1 --directory <build-directory>`.
This is a validation aid, not a runtime dependency of the delivered experience.
For dynamic simulations, separate `update(dt)` from rendering. When useful,
expose a small development hook such as `window.__lesson = {state, advance(seconds)}`.
Have `advance` run the same update logic in bounded simulation steps and render
the resulting state; it must not bypass scoring, support tracking or transitions.
Use it to check elapsed-time behaviour without waiting for animation frames, then
also exercise real controls and motion. Static lessons do not need a test hook.

Finish with one real `file://` open in a browser that supports it, with network
disabled, to verify the standalone deliverable. A server-only pass does not
establish offline operation. If no available browser supports this check, report
it as untested rather than claiming success. Apply the existing connected-mode
exception below when explicitly approved.

1. Open the built HTML using the appropriate browser launch path above. Inspect the illustrated question
   cover at desktop, phone and a short viewport. Check visual craft, loaded font,
   question readability and a clear icon-plus-label start action. Keyboard focus
   and touch must not reach underlying lesson controls. Start with keyboard and
   touch, confirm clean entry/focus, then restart after a response: it must return
   to the cover and clear previous responses, hints and reveals. Cover motion
   respects reduced motion and the artwork does not reveal independent answers.
   Inspect an actual lesson screenshot at the
   intended viewport. Is the main learning action clear, the representation
   intelligible and the next manipulation obvious? Enforce the single-title,
   single-instruction budget, allowing concise functional button labels. Verify
   buttons combine icons and labels unless an icon-only exception is justified.
   Check the lesson hierarchy: small top-left title, large prominent current instruction
   or explanation. Verify embedded Baloo 2 with the house-style roles: 500
   sentence-case titles, 550 explanations and 500 button labels. Compare the
   accent-rule explanation, label chips and outlined button states with
   [component-styling.md](component-styling.md) during feedback and narrow layouts
   as well as entry.
   Check actual visible text including canvas labels,
   banners, tooltips and feedback, not only paragraph counts.
   Compare scene composition with [visual-design.md](visual-design.md) and Water
   Lab. For spatial goals verify actual Three.js rendering, in-scene manipulation,
   loaded bundled fonts and responsive framing. Verify crafted cel shading, flat
   color, stepped light/shadow and clean black object outlines; inspect outline
   quality during object/camera movement, not just a still. Judge beauty, craft
   and polish separately from whether the simulation functions.
   Choose the explanation side for each camera view, including transitions and
   alternate apparatus. Check that scenery or a second apparatus never passes
   behind the instruction text; reserve clear space as the camera and objects move.
2. Exercise the interaction and capture consequential states: supported practice,
   a wrong prediction and its feedback, and an independent transfer task before
   and after reveal. Inspect viewpoints, overlaps, motion, text budget and whether the
   UI accidentally gives away the answer. Check narrow and intended-device layouts;
   feedback must replace the instruction rather than grow the page.
3. Fix the most consequential UX or teaching defects. Re-render and inspect the
   revised states, then re-exercise affected actions. If the first rendering needs
   no change, state the specific criteria checked rather than manufacturing edits.
4. Retain concise development evidence outside the child-facing experience:
   screenshots, scenarios exercised, observations and fixes, or the reason no
   revision was needed. Static inspection cannot stand in for this loop.

Also inspect the vocabulary support in actual cover, instruction, feedback,
button and extension states. Check that the technical-word inventory is covered
(including plurals and phrases), meanings are accurate and short, and a term's
hover/tap/keyboard interaction shows one readable explanation. Exercise movement
into the popup, Escape/close/outside dismissal, focus restoration, dynamic copy
and narrow positioning. Confirm no definition wrappers or dashed word-help
underlines occur inside buttons (including ARIA buttons), links, disclosure
controls or form labels, including dynamically created controls. Hover/focus
must not open definitions there; clicking/tapping directly on the label and
keyboard activation must perform the control's action. Confirm
word help preserves evidence unless vocabulary recall is the assessed goal, and
never reveals the current answer. Avoid duplicate wrappers after scene changes. Check that instruction updates
produce one plain-text live announcement rather than repeated term-wrapping
mutations; browser accessibility inspection alone is not a screen-reader test.

Also exercise:

- Hover and press every in-scene control; it must move only by the lift amount.
  Check that its anchor is preserved on release and when disabled.

- The core path from start to completion, correct and incorrect answers, repeated
  attempts, hints, recovery/reteaching, independent check, extension and restart.
- For branching flows, enter investigations in different orders, leave one
  unfinished and return, revisit after help/reveal, and distinguish resume from
  replay/full restart. Navigation must preserve the relevant experiment and
  evidence; it must not bypass prerequisites or manufacture independent success.
  For dynamic systems, also use [simulation-design.md](simulation-design.md).
- Any generated task/answer pairs, boundary values, randomization and state changes.
  In particular, restarting or retrying must not corrupt scores or expose stale
  answers; independent success must not inherit a supported-practice flag.
- Keyboard navigation and visible focus, narrow-screen layout, understandable
  controls/feedback and alternatives to interaction-specific barriers.
- Console errors and unexpected requests. Confirm required assets and interactions
  work offline via `file://`, with no server, CDN, fonts or remote data required
  by default. For explicitly approved connected LLM mode, validate the agreed
  launch path and the checks in [llm-connected-experiences.md](llm-connected-experiences.md);
  local assets still render without network. Report any untested live connection.

For assessable transfer tasks, deliberately try an incorrect prediction, hints,
retries and direct reveal before answering. Confirm that none earns independent
success, the revealed answer matches the model, and a fresh independent task can
still be attempted. For spatial models, check viewpoint consistency and boundary
states rather than trusting one attractive screenshot.

Use small targeted code checks for nontrivial task generation or scoring logic
when useful. If browser execution is unavailable, inspect the code and calculations,
state which checks were possible, and provide a short manual smoke checklist.
Do not label static inspection as a browser pass or deliver it as a UX-validated
experience. Identify the artifact as a prototype awaiting browser validation.

## Handoff

Report the checks performed, significant assumptions and remaining limitations
briefly. Keep the adult research/design note separate from the child's main flow.
Actual observation of the child is the next evaluation step; no automated review
can establish that the experience teaches this particular learner effectively.
