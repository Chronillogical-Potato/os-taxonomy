import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const load = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const topics = new Map(load('../data/topics.json').topics.map(t => [t.id, t]));
const mappings = load('../reports/acara-v9-retired-topic-mappings-2026-10-23.json').retirements;
const ledger = load('../reports/acara-v9-execution-ledger-2026-10-23.json').entries;

test('retired topic maps are flat and agree with the execution ledger', () => {
  const byId = new Map(mappings.map(r => [r.retiredId, r]));
  assert.equal(byId.size, mappings.length);
  assert.deepEqual([...byId.keys()].sort(), ledger.filter(r => r.finalStatus === 'retired').map(r => r.id).sort());
  for (const row of mappings) {
    assert.ok(!topics.has(row.retiredId), `${row.retiredId} is still active`);
    assert.ok(row.destinations.length > 0);
    for (const destination of row.destinations) {
      assert.ok(topics.has(destination.topicId), `${row.retiredId} has a missing or intermediate destination`);
      assert.ok(destination.clause.trim());
    }
    assert.deepEqual(ledger.find(r => r.id === row.retiredId).destinations, row.destinations);
  }
});

test('retired fabrication bundles preserve four separately assessed procedures', () => {
  const required = ['mt_8FUXG_39-C', 'mt_uUMLgRTrhn', 'mt_EiI2PPWPHJ', 'mt_FfMBoU1jt7'];
  for (const id of ['mt_Re97rQJx_e', 'mt_aGuP78tRMo']) {
    const row = mappings.find(r => r.retiredId === id);
    assert.ok(row);
    for (const destination of required) assert.ok(row.destinations.some(d => d.topicId === destination), `${id} is missing ${destination}`);
    for (const destination of row.destinations.filter(d => d.topicId === 'mt_8FUXG_39-C')) {
      assert.doesNotMatch(destination.clause, /drill|glue|adhesive|sew|workshop/i);
    }
  }
});
