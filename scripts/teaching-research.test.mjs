import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkSchema } from './check-schema.mjs';
import { checkTeachingResearch } from './check-teaching-research.mjs';
const load = name => JSON.parse(readFileSync(new URL(name, import.meta.url)));
const research = load('../data/teaching-research.json');
const context = { topics: load('../data/topics.json'), topicsBytes: readFileSync(new URL('../data/topics.json', import.meta.url)), manifest: load('../data/manifest.json'), schema: load('../schema/teaching-research.schema.json') };
test('published research passes schema and cross-file checks', () => assert.deepEqual(checkTeachingResearch(research, context), []));
test('rejects stale version, unknown topic, duplicate record, broken citation and wrong coverage', () => {
 for (const mutate of [r => {r.version='v2'}, r => {r.records[0].topicId='mt_missing'}, r => r.records.push(structuredClone(r.records[0])), r => {r.records[0].learn.activities[0].sourceClaims=['not a source']}, r => {r.coverage.withResearch++}, r => {r.topicFileSha256='0'.repeat(64)}, r => {r.records[0].learn.schemaVersion=1}, r => {r.records[0].privateDbId='secret'}, r => {r.records[0].assess.errorPatterns[0].reteachPrerequisiteId='mt_missing'}]) {
  const copy = structuredClone(research); mutate(copy); assert.ok(checkTeachingResearch(copy, context).length > 0);
 }
});
test('schema validator fails closed on unknown keywords and checks nested types', () => {
 assert.throws(() => checkSchema('x', { unknownKeyword: true }));
 assert.ok(checkSchema({ items: ['x', 3] }, { type:'object',properties:{items:{type:'array',items:{type:'string'}}},additionalProperties:false }).length > 0);
});
