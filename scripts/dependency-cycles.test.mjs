import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { findDependencyCycle } from './check-dependency-cycles.mjs';

const edge = (topicId, prerequisiteId, strength = 'hard') => ({ topicId, prerequisiteId, strength });

test('allows empty, disconnected, diamond and repeated-edge DAGs', () => {
  assert.equal(findDependencyCycle([]), null);
  assert.equal(findDependencyCycle([
    edge('a', 'b'), edge('a', 'c'), edge('b', 'd'), edge('c', 'd'),
    edge('a', 'b'), edge('e', 'f'),
  ]), null);
});

test('finds self, two-topic and disconnected mixed-strength cycles', () => {
  assert.deepEqual(findDependencyCycle([edge('a', 'a')]), ['a', 'a']);
  assert.deepEqual(findDependencyCycle([edge('a', 'b'), edge('b', 'a')]), ['a', 'b', 'a']);
  assert.deepEqual(findDependencyCycle([
    edge('a', 'b'), edge('x', 'y'), edge('y', 'z', 'soft'), edge('z', 'x'),
  ]), ['x', 'y', 'z', 'x']);
});

test('handles long chains without recursive stack overflow', () => {
  const chain = Array.from({ length: 20000 }, (_, i) => edge(`n${i}`, `n${i + 1}`));
  assert.equal(findDependencyCycle(chain), null);
  chain.push(edge('n20000', 'n19999', 'soft'));
  assert.deepEqual(findDependencyCycle(chain), ['n19999', 'n20000', 'n19999']);
});

test('validator rejects a cycle even when counts and checksums match', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'taxonomy-cycle-'));
  try {
    for (const directory of ['data', 'schema', 'scripts']) {
      cpSync(new URL(`../${directory}`, import.meta.url), join(fixture, directory), { recursive: true });
    }
    const dependencyPath = join(fixture, 'data', 'dependencies.json');
    const manifestPath = join(fixture, 'data', 'manifest.json');
    const dependencies = JSON.parse(readFileSync(dependencyPath, 'utf8'));
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const original = dependencies.dependencies[0];
    dependencies.dependencies.push({
      ...edge(original.prerequisiteId, original.topicId, 'soft'),
      reason: 'Synthetic reverse-edge regression fixture.',
    });
    dependencies.edgeCount = dependencies.dependencies.length;
    const bytes = `${JSON.stringify(dependencies, null, 2)}\n`;
    writeFileSync(dependencyPath, bytes);
    manifest.counts.dependencies = dependencies.edgeCount;
    manifest.files['dependencies.json'] = {
      bytes: Buffer.byteLength(bytes),
      sha256: createHash('sha256').update(bytes).digest('hex'),
    };
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    const result = spawnSync(process.execPath, [join(fixture, 'scripts', 'validate.mjs')], { encoding: 'utf8' });
    assert.ifError(result.error);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /dependency cycle:/);
    assert.ok(result.stderr.includes(original.topicId));
    assert.ok(result.stderr.includes(original.prerequisiteId));
    assert.doesNotMatch(result.stderr, /checksum mismatch|byte count mismatch/);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
