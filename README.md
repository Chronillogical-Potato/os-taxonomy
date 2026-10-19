# Marble Skill Taxonomy

An open, structured taxonomy of **what children learn** across the primary/elementary years — decomposed into fine-grained "micro-topics", wired into a prerequisite graph, and aligned to national curriculum standards. Produced by [Marble](https://withmarble.com).

> **Version:** `v1` · **Topics:** 1,591 · **Prerequisite edges:** 3,225 · **Subjects:** 8

## See it

![The taxonomy as a rotating 3D graph: every dot a micro-topic, colored by subject, wired by prerequisites](media/curriculum-viz.gif)

Every dot is a micro-topic, colored by subject; height is age; each thread is a prerequisite ([full-quality video](media/curriculum-viz.mp4)). Explore it interactively at [withmarble.com/curriculum](https://withmarble.com/curriculum) — tap any concept to trace everything a learner must master before it.


## What this is

Most curriculum data is either a flat list of standards or locked inside a product. This dataset is a **connected graph of learning**:

- **1,591 micro-topics** — a single, teachable idea (e.g. *"Building sentences"*, *"Apparent brightness of stars"*), each with a plain-language description, mastery **evidence** criteria, a type (conceptual / procedural / representational / language / meta), a subject + domain, and an approximate age range.
- **3,225 prerequisite dependencies** — a directed acyclic graph: *"topic X depends on prerequisite Y"*, each edge tagged `hard`/`soft` and carrying a one-line **reason**.
- **Curriculum alignment** — each micro-topic links to the standards it was distilled from (NGSS, Common Core, the UK National Curriculum, and more).
- **Teaching research** — 1,051 records covering the current Science and Mathematics topics: teaching approaches, concrete learning activities, feedback, assessment guidance and linked sources. Coverage is partial; the other 540 topics have no research in this release.
- **Domain clusters** — 176 parent-friendly one-paragraph summaries per (subject, domain, age band).

### Subjects

| Subject | Topics |
|---|---:|
| Science | 547 |
| Mathematics | 504 |
| English | 286 |
| History | 90 |
| Personal & Social Development | 88 |
| Life Skills | 37 |
| Computing | 21 |
| Learning to Learn | 18 |

## Files

All data lives in [`data/`](data/) as UTF-8 JSON. See [`schema/`](schema/) for JSON Schemas and [`manifest.json`](data/manifest.json) for counts + SHA-256 checksums.

| File | What it holds |
|---|---|
| [`data/topics.json`](data/topics.json) | The micro-topics (graph **nodes**). |
| [`data/dependencies.json`](data/dependencies.json) | Prerequisite **edges** (`topicId` depends on `prerequisiteId`). |
| [`data/curriculum-standards.json`](data/curriculum-standards.json) | The source curriculum standards, grouped by curriculum. |
| [`data/clusters.json`](data/clusters.json) | Parent-friendly domain summaries. |
| [`data/teaching-research.json`](data/teaching-research.json) | Teaching research joined by `topicId`, with explicit coverage and publication notes (~24 MB). |
| [`data/manifest.json`](data/manifest.json) | Counts, per-subject breakdown, per-file checksums. |

### A topic

```json
{
  "id": "mt_N8CpN1EJrP",
  "type": "CONCEPTUAL",
  "subject": "English",
  "domain": "Grammar & Punctuation",
  "name": "Building sentences",
  "description": "Understand that words combine to make sentences — a sentence expresses a complete thought…",
  "ageRangeStart": 4,
  "ageRangeEnd": 6,
  "centrality": 0.257,
  "evidence": [
    "Distinguish between complete sentences and fragments",
    "Compose a complete sentence with a subject and verb"
  ],
  "assessmentPrompt": "If {{name}} says something like \"The dog\", can they tell you that's not a complete sentence…?",
  "standards": ["ccss-ela:L.K.1f", "uk-nc-2013:Eng.App2.Y1.Sent.1"]
}
```

- `id` — stable identifier (`mt_…`), referenced by dependencies and by neighbours.
- `standards` — keys into `curriculum-standards.json` (`"<curriculum-slug>:<code>"`).
- `assessmentPrompt` — a natural-language check for the idea. Contains a `{{name}}` placeholder (the child's name); substitute or strip before display.

### A dependency

```json
{ "topicId": "mt__00ZSLnB7p", "prerequisiteId": "mt_VBl1T1sFCM", "strength": "hard",
  "reason": "Must understand vibrations make sound before finding volume patterns" }
```

`topicId` **depends on** `prerequisiteId`. Reverse the edge to get "unlocks".

## Teaching research

[`data/teaching-research.json`](data/teaching-research.json) adds **how a topic
might be taught** to the graph of what children learn. It covers **547 Science**
and **504 Mathematics** topics. `coverage.missingTopicIds` and per-subject counts
make the **540 topics without research** explicit; absence is not a judgement
about whether a topic can be taught.

The file has `schemaVersion: 1` and taxonomy `version: "v1"`. Each `records[]`
entry joins `topics.json` through `topicId` and contains:

| Field | Meaning |
|---|---|
| `pedagogy` | Original teaching summary, practices, representations and misconceptions. |
| `learn` | Portable learning guidance (`schemaVersion: 2`): a summary, activities, educational constraints and review notes. |
| `learn.activities[]` | Learner actions, intended insight, feedback, rationale and supporting source claims. No product artifact types or fit rankings. |
| `assess` | Original diagnostic/task, response levels, error patterns and next teaching moves; nullable in the public interface. |
| `sources` | Claim, named source, optional URL and the original author's verification flag. |
| `confidence` | Original authoring confidence; not an independent quality score. |
| `provenance` | Original authoring model and source record timestamps. The update timestamp also reflects the learning-guidance rewrite. |
| `publicationNotes` | Paths and curriculum codes for text omitted under the codes-only publication policy. |

`sourceClaims` exactly match `sources[].claim` after publication transformations.
A source may support a general principle or curriculum alignment; this does not
mean the proposed activity was tested. Some activities have no directly linked
source claim.

These records were agent-authored. The learning guidance was rewritten for
portability, checked by a separate factual critic, and sampled by a second agent.
Most original pedagogy and assessment were retained and may contain claims that
the updated guidance qualifies; chart-specific alignment repairs after #30 are
recorded in the affected learning-guidance review notes; read the constraints and review notes alongside
them. Sources were **not re-fetched or re-verified** for this release. Historical
`verified: true` and `confidence: "high"` are not new evidence ratings. Activities
are research-informed proposals, **not empirically validated interventions**.

Some original research quoted restricted curriculum standards. Matched passages
are replaced with inline curriculum references, including inside citation claims;
all transformed paths are listed in `publicationNotes`. This is a conservative
mechanical omission pass, not comprehensive rights clearance. Consult the linked
upstream sources for their wording and terms. See [PROVENANCE.md](PROVENANCE.md).

After the chart split in [#30](https://github.com/withmarbleapp/os-taxonomy/pull/30),
`mt_bESTSBB0wK` covers pie charts, `mt_H6LlpWgEYS` covers earlier line-graph
problem-solving, and `mt_HlNSurPVDp` has a separate construction-and-interpretation
record. The new record adapts existing graph research; it is not a fresh
literature review, and all reused source-verification flags are false. Its
assessment requires a complete constructed graph. The later grouped-charts
assessment routes graph-choice errors to data presentation and sector-angle
errors to pie charts.

The file is bound to the exact `topics.json` bytes through `topicFileSha256`.
Regenerate the research projection when the canonical topic file changes, even
when topic IDs remain stable.

## Using it

Pure data — no runtime, no dependencies. Load the JSON and go.

```js
import topics from './data/topics.json' with { type: 'json' };
import deps from './data/dependencies.json' with { type: 'json' };

const byId = new Map(topics.topics.map(t => [t.id, t]));
const prereqs = deps.dependencies
  .filter(d => d.topicId === 'mt_N8CpN1EJrP')
  .map(d => byId.get(d.prerequisiteId).name);
```

Join teaching guidance to a topic:

```js
import research from './data/teaching-research.json' with { type: 'json' };

const guidanceByTopic = new Map(research.records.map(r => [r.topicId, r]));
const guidance = guidanceByTopic.get('mt_N8CpN1EJrP'); // undefined: English is not covered yet
const activities = guidance?.learn.activities ?? [];
```

Validate structure, research coverage, evidence links and checksums:

```bash
node scripts/validate.mjs
node --test scripts/teaching-research.test.mjs
```

## Create a learning experience

The [`create-learning-experience` agent skill](.agents/skills/create-learning-experience/SKILL.md)
helps turn a child's age and a user-confirmed goal into a standalone, offline HTML
learning experience. It uses topic prerequisites and available teaching research,
develops a targeted research brief when needed, and agrees a concept with you
before building. Experiences use visual interactions, scaffolding, UI-assessed
transfer tasks and optional extensions. Spatial topics use Three.js with direct
scene manipulation. The public skill includes Marble-derived UI tokens, tactile
controls and an openly licensed rounded font, with one title and one instruction
visible at a time. [Water Lab](https://withmarble.com/water-lab) is the visual quality
reference. The agent renders, inspects and iterates
in the browser rather than stopping at the first working HTML file.

In Codex, open this repository and invoke `$create-learning-experience`, for example:

> Use $create-learning-experience to help my 8-year-old understand why equivalent
> fractions represent the same quantity.

Other agents can follow the linked `SKILL.md` directly. No Marble account or
hosting is required. New reusable teaching research can optionally be proposed
as a separate PR, with no child-specific information included.

## License

This dataset is **multi-licensed** — read this before you use or redistribute it.

| Layer | License |
|---|---|
| **The database** — the collection, structure, IDs, topic↔topic and topic↔standard relationships | [**ODbL 1.0**](LICENSE) — free for research **and** commercial use, **attribution** required, **share-alike** (derivative *databases* must stay open under ODbL). |
| **The textual content Marble authored** — topic `description`/`name`/`evidence`/`assessmentPrompt`, dependency `reason`s, cluster `summary`s, original teaching-research prose | [**CC BY-SA 4.0**](LICENSE-CONTENT) — same spirit: attribution + share-alike. |
| **`curriculum-standards.json`** — extracted from third-party frameworks | **Not** Marble's to relicense. Each source is under **its own upstream license** — see [**PROVENANCE.md**](PROVENANCE.md). |

**Why share-alike + still commercial-friendly:** ODbL distinguishes a *derivative database* (extend/modify the taxonomy → must stay open) from a *produced work* (use it inside a product, model, or app → stays yours). So you can build a commercial product on this without open-sourcing your product; you only owe back improvements to the *taxonomy itself*.

### Attribution

Any use must credit:

> Marble Skill Taxonomy (v1) · © Generative Spark, Inc. (Marble) · https://withmarble.com · licensed under ODbL 1.0 (database) and CC BY-SA 4.0 (content).

Plus the upstream notices in [PROVENANCE.md](PROVENANCE.md) for any curriculum standards you use. See [CITATION.cff](CITATION.cff) for a formal citation.

## What's *not* here

Deliberately excluded from this release: semantic embeddings (derived, recomputable) and any per-child / user data (never published). See [CHANGELOG.md](CHANGELOG.md).
