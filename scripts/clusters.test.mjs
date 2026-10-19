import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

test('validator rejects orphaned subject/domain pairs without requiring an exact age match', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'taxonomy-clusters-'));
  try {
    for (const directory of ['data', 'schema', 'scripts']) {
      cpSync(new URL(`../${directory}`, import.meta.url), join(fixture, directory), { recursive: true });
    }
    const clustersPath = join(fixture, 'data', 'clusters.json');
    const manifestPath = join(fixture, 'data', 'manifest.json');
    const original = JSON.parse(readFileSync(clustersPath, 'utf8'));
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const topics = JSON.parse(readFileSync(join(fixture, 'data', 'topics.json'), 'utf8')).topics;
    const science = topics.find(t => t.subject === 'Science');
    const cases = [
      { subject: 'Science', domain: 'Earth & Human Activity', valid: false },
      { subject: 'Science', domain: 'Heredity & Evolution', valid: false },
      { subject: 'Mathematics', domain: science.domain, valid: false },
      { subject: science.subject, domain: science.domain, valid: true },
    ];
    for (const { subject, domain, valid } of cases) {
      const clusters = structuredClone(original);
      clusters.clusters.push({ subject, domain, ageRangeStart: 99, summary: 'Integrity regression fixture.' });
      clusters.clusterCount = clusters.clusters.length;
      const bytes = `${JSON.stringify(clusters, null, 2)}\n`;
      writeFileSync(clustersPath, bytes);
      manifest.counts.clusters = clusters.clusterCount;
      manifest.files['clusters.json'] = {
        bytes: Buffer.byteLength(bytes),
        sha256: createHash('sha256').update(bytes).digest('hex'),
      };
      writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      const result = spawnSync(process.execPath, [join(fixture, 'scripts', 'validate.mjs')], { encoding: 'utf8' });
      assert.ifError(result.error);
      if (valid) {
        assert.equal(result.status, 0, result.stderr);
      } else {
        assert.equal(result.status, 1, result.stderr);
        assert.match(result.stderr, /no topics in this subject\/domain/);
        assert.doesNotMatch(result.stderr, /checksum mismatch|byte count mismatch/);
      }
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
