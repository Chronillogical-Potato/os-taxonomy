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
  program can assess the evidence honestly. Supply an adult rubric when it cannot;
  absence of a reliable automatic judgement must not silently count as mastery.
- Check optional extension, reading demands and adult involvement fit the concept.
  Avoid describing a short session result as long-term retention or transfer
  beyond what the child actually demonstrated.

## Browser checks

Open the saved file directly in a browser when tooling is available. Exercise:

- The core path from start to completion, correct and incorrect answers, repeated
  attempts, hints, recovery/reteaching, independent check, extension and restart.
- Any generated task/answer pairs, boundary values, randomization and state changes.
  In particular, restarting or retrying must not corrupt scores or expose stale
  answers; independent success must not inherit a supported-practice flag.
- Keyboard navigation and visible focus, narrow-screen layout, understandable
  controls/feedback and alternatives to interaction-specific barriers.
- Console errors and unexpected requests. Confirm required assets and interactions
  work offline via `file://`, with no server, CDN, fonts or remote data required.

Use small targeted code checks for nontrivial task generation or scoring logic
when useful. If browser execution is unavailable, inspect the code and calculations,
state which checks were possible, and provide a short manual smoke checklist.
Do not label static inspection as a browser pass.

## Handoff

Report the checks performed, significant assumptions and remaining limitations
briefly. Keep the adult research/design note separate from the child's main flow.
Actual observation of the child is the next evaluation step; no automated review
can establish that the experience teaches this particular learner effectively.
