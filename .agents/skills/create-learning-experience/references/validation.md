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

## Browser iteration

Render early, inspect, revise and render again. Start with the risky interaction,
then check the integrated experience. Use available browser automation or manual
browser tools; inspecting source or the DOM alone does not validate presentation.

1. Open the saved HTML directly in a browser. Inspect an actual screenshot at the
   intended viewport. Is the main learning action clear, the representation
   intelligible and the next manipulation obvious? Enforce the single-title,
   single-instruction budget, allowing concise functional button labels. Verify
   buttons combine icons and labels unless an icon-only exception is justified.
   Check the hierarchy: small top-left title, large prominent current instruction
   or explanation. Verify it during feedback and narrow layouts as well as entry.
   Check actual visible text including canvas labels,
   banners, tooltips and feedback, not only paragraph counts.
   Compare scene composition with [visual-design.md](visual-design.md) and Water
   Lab. For spatial goals verify actual Three.js rendering, in-scene manipulation,
   loaded bundled fonts and responsive framing. Verify crafted cel shading, flat
   color, stepped light/shadow and clean black object outlines; inspect outline
   quality during object/camera movement, not just a still. Judge beauty, craft
   and polish separately from whether the simulation functions.
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

Also exercise:

- The core path from start to completion, correct and incorrect answers, repeated
  attempts, hints, recovery/reteaching, independent check, extension and restart.
- Any generated task/answer pairs, boundary values, randomization and state changes.
  In particular, restarting or retrying must not corrupt scores or expose stale
  answers; independent success must not inherit a supported-practice flag.
- Keyboard navigation and visible focus, narrow-screen layout, understandable
  controls/feedback and alternatives to interaction-specific barriers.
- Console errors and unexpected requests. Confirm required assets and interactions
  work offline via `file://`, with no server, CDN, fonts or remote data required.

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
