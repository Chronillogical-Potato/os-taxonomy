# Changelog

All notable changes to the Marble Skill Taxonomy dataset are documented here.
Dataset releases are versioned independently of the taxonomy `version` field
(the underlying taxonomy is `v1`).

## [Unreleased]

- Add 620 Australian Curriculum v9 Foundation–Year 6 content descriptions (`acara-v9`) from Marble's canonical standards catalogue, bringing the total to 8 curricula and 3,881 standards. Correct five Foundation Science inquiry strand assignments and restore six standards missed by the contributor's parser. Retain the existing graph and topic alignments; candidate Australian mappings are not included.
- Correct five later-age prerequisites and two adjacent dependency relationships, replacing later reinforcement with earlier foundational skills.
- Adjust the approximate starting age for Drawing Force Diagrams from 7 to 8 and regenerate graph centrality; retain teaching-research content while refreshing its topic-file checksum binding.
- Remove seven stale Science cluster summaries whose domains contain no topics, leaving 176 clusters.
- Validate that every cluster subject/domain pair exists among topics, with regression coverage for orphaned domains and subject mismatches.
- Add 1,051 teaching-research records for Science (547) and Mathematics (504), joined by stable topic ID, with explicit coverage for the other 540 topics.
- Align research after the chart split: pie-only teaching/assessment, restored earlier line-graph scope, a new construction-and-interpretation record, and corrected downstream assessment recovery routes.
- Publish portable learning guidance with activities, learner actions, feedback and evidence links; retain original pedagogy, assessment and historical source-verification metadata.
- Add teaching-research JSON Schema, cross-file/evidence-link validation, regression checks and a topic-file checksum binding.
- Mark curriculum-text publication omissions inline and by field path; exclude private database IDs, learner data and migration audit artifacts.
- Separate pie-chart and line-graph coverage: retain `mt_bESTSBB0wK` for pie charts and add `mt_HlNSurPVDp` for line graphs.
- Correct the earlier line-graph problem-solving topic's title and description; revise prerequisites and downstream links for the split.
- Restore 330 previously authored curriculum links by normalizing legacy alignment identifiers, including the UK Year 6 chart standard on both chart topics.
- Use discrete/continuous-data presentation as the prerequisite for later grouped-data charts; clarify their pie-chart prerequisite reason.
- Regenerate the canonical export and centrality scores: 1,591 topics and 3,225 dependencies.

## [1.0.0] — 2026-07-08

Initial public release.

### Included
- **1,590 micro-topics** across 8 subjects (`data/topics.json`).
- **3,221 prerequisite dependencies** with `hard`/`soft` strength + reasons (`data/dependencies.json`).
- **7 curricula / 3,261 standards** with 1,859 topic↔standard links (`data/curriculum-standards.json`).
- **183 domain clusters** (`data/clusters.json`).
- JSON Schemas + a dependency-free validator.

### Curriculum text shipped
- **Full text:** UK National Curriculum (OGL v3.0), Common Core ELA + Math (CCSS Public License).
- **Codes only** (verbatim text omitted pending rights clearance): NGSS K-5 + Middle School, C3 Framework, IB PYP PSPE. See [PROVENANCE.md](PROVENANCE.md).

### Excluded
- Semantic embeddings (derived / recomputable).
- All per-child and user data (never published).
