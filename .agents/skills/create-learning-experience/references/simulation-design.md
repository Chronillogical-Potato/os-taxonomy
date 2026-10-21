# Design investigations with dynamic simulations

Use this guidance when learners intervene in a system and observe outcomes over
time. [Otter Forest](../examples/otter-forest/design.md) illustrates these
patterns; it is a qualitative teaching model, not an empirical forecast.

## Make experiments interpretable

Identify which relationships the model actually computes and which are staged
illustrations. A scheduled animation can explain a mechanism, but should not be
presented as emergent behavior. Document consequential omissions, time scales
and illustrative parameters in the adult note. The child-facing representation
must not imply a stronger claim than the model supports.

For a comparison intended to isolate an intervention, use the same starting
state and elapsed model time. Preserve relevant random state where applicable;
do not silently reroll the world. A previous attempt at a different endpoint
can still be useful, but distinguish it from a controlled comparison. Avoid
changing other conditions unnoticed when the learner changes one variable.

Offer pause, speed adjustment, replay or undo where they make the phenomenon
inspectable and experimentation recoverable. Replaying an experiment should
restore its relevant starting state; returning from a menu should resume or
pause according to a deliberate, understandable rule. Camera changes must not
change the modeled world. Keep elapsed model time separate from rendering time.

## Make success observable without substituting it for understanding

If a goal concerns persistence, require its conditions to hold over a meaningful
observation interval rather than rewarding a momentary threshold crossing.
Choose the interval for the model and goal; do not copy Otter's values. Specify
what interventions or unmet conditions do to that interval. Record an achieved
observation honestly without promising permanent stability.

Use the same predicates for displayed requirements and success checking. When
needed, show concise goal quantities or notation as functional task information,
with their text-budget exception agreed during concept design. Avoid extra
explanation panels; gauges with different scales must not suggest comparable
population ratios or units.

Treat goal achievement and evidence of understanding separately. A learner can
reach a desirable state through trial and error. Follow with an appropriate
causal construction, prediction or fresh intervention task when the goal needs
that evidence. Free exploration can remain unscored. Keep assistance and reveal
history with the relevant task across navigation and replay.

## Validate the investigation, not only the interface

Check representative interventions and important counterexamples against the
intended teaching claims: increasing an input should not always improve an
outcome merely because the preferred story says so. Include depletion, delayed
consequences or failure to recover where the actual model requires them. Use
reproducible scenarios and bounded runs; do not equate attractive motion with
plausible dynamics.

Check matched-time comparisons, replay state, pause/speed behavior and sustained
goal detection. Exercise leaving an unfinished investigation and returning,
changing branch order, and revisiting a hinted or revealed assessment. Verify
that live labels remain usable for keyboard focus and vocabulary help while
values update. Test drag/pinch/cancellation without accidental edits.

An arranged goal flag can isolate reflection UI in a smoke test, but it does
not validate goal reachability, balance or the observation interval. Report
those checks separately, including which ecological or other domain claims
remain unvalidated. Automated checks do not establish learning effectiveness.
