# Optional connected LLM experiences

Read this only when the learning goal meets the runtime-LLM criteria in
[SKILL.md](../SKILL.md). This reference describes an optional mode; it supplies
neither a working connector nor authorization to include or exercise live calls.

## Agree the learning role and permission

An appropriate use might be a child practicing an unscripted dialogue or
producing an original argument that needs feedback on its reasoning. Explain why
prepared responses, local rules or a simulation would lose essential evidence.
The presence of a text box alone is not a reason to use an LLM. Keep physically
modeled outcomes and objectively checkable answers deterministic.

Before implementation, obtain explicit author approval for runtime LLM use in
this experience. Present the proposed learning interaction, provider/connection,
what child-authored text or task context leaves the device, whose plan or credits
are used, usage limits and the network/local-service requirement. Agree any
necessary exception to the visual text budget for reading or text production;
LLM use alone does not relax that budget. If the author declines, refine the goal
or local design together. Do not include a dormant live-call path as a workaround.

Author approval is separate from the parent's eventual account authorization.
Do not run paid or child-data test calls merely because integration was approved;
use synthetic examples and the session's actual authorization for live tests.

## Connection and provider choice

Use a trusted local connection service for the initial local/open-source pilot.
Keep provider credentials there, outside generated HTML, browser storage, logs
and child-facing UI. The parent connects and disconnects their own account and
reviews usage outside the learning canvas. The service exposes a narrow,
experience-scoped inference interface, enforces agreed usage limits and allowed
browser origins, and does not offer arbitrary pages unrestricted account access.
Reuse an existing suitable connector when available; otherwise deliver its
required setup alongside the HTML and describe the extra runtime honestly.

**ChatGPT plan usage is an optional preview provider, not a required dependency.**
Official documentation checked 2026-10-20 describes eligible Plus/Pro users and
open-source/local integrations. Paid or remotely hosted integrations have a
separate access path; do not assume that hosting an open-source experience on
Marble qualifies. Verify current eligibility and requirements before building:

- [Quickstart](https://developers.openai.com/siwc/quickstart) and
  [open-source overview](https://developers.openai.com/siwc/token-sharing-open-source):
  identity-only sign-in is insufficient; request explicit ChatGPT plan permission.
- [Registration and sign-in](https://developers.openai.com/siwc/token-sharing-open-source/sign-in)
  and [accounts and sessions](https://developers.openai.com/siwc/token-sharing-open-source/profiles-and-sessions):
  follow the supported OAuth flow, protect credentials, refresh and revoke sessions.
  Plus allowances are shared across connected apps; this is not unlimited inference.
- [Preview limitations](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations):
  currently require streamed Responses with `store: false`, client-supplied history,
  and a restricted parameter/tool set. Audio input is not supported by this flow.
- [UI guidance](https://developers.openai.com/siwc/ui-ux-guidelines) and
  [errors and recovery](https://developers.openai.com/siwc/token-sharing-open-source/errors-and-recovery):
  show required account/usage disclosures and handle denied consent, exhausted
  allowances and revoked access. Resolve required disclosures in concept design
  rather than omitting them to meet the text budget.

Keep the experience's inference interface provider-independent. Agree any
alternative billing path with the author; never silently switch to Marble's or
another account's paid credentials. Do not promise the preview's future stability.

## Teaching, assessment and failure behavior

Send only the task context and learner response needed for the agreed interaction;
exclude names, full learner profiles and unrelated history. Treat learner and
model text as untrusted data, render it safely, and give the model no tools or
arbitrary code execution. Keep output concise and appropriate to the agreed age.

Define assessment criteria from the learning goal before writing the evaluator.
Constrain feedback to those criteria and check evidence rather than writing
length or fluency. Model feedback is fallible: ambiguous or failed evaluations
must not award mastery. Preserve independent attempts separately from hints and
assisted revisions. Do not present an LLM judgment as a validated diagnosis.

While waiting, preserve the child's work and make the interaction's state clear.
On denial, disconnection, timeout or exhausted allowance, offer retry or an agreed
local continuation. If the goal cannot continue locally, pause that part honestly;
do not fabricate feedback or mark an unchecked response successful. Prevent
duplicate submissions and automatic retry loops that consume the parent's plan.

## Validate and hand over

In addition to normal browser iteration, exercise synthetic relevant, incorrect,
ambiguous and off-topic responses; instruction attempts inside learner text; and
model output that is malformed, unsafe or contradicts the task evidence. Check
that feedback stays within the agreed scope and cannot bypass mastery criteria.

Exercise pending/partial streams, denial, timeout, limits, revocation, retry and
restart. Confirm unfinished output cannot score an answer and old responses cannot
overwrite a newer attempt. Check credential isolation and the actual data sent.
Use mocks for these cases when practical. Distinguish mocked checks from a live
OAuth/inference smoke test; do not claim live validation without performing it.

Deliver the self-contained HTML, connection-service setup and an adult note with
the approved LLM role, provider, data transfer, usage/cost assumptions, failure
behavior and actual validation. Clearly identify the result as connected rather
than offline. Do not require the child to handle provider accounts or credentials.
