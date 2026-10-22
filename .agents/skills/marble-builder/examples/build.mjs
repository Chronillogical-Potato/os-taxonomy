// Rebuild portable reference sources without touching the reviewed snapshots.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';

const root = path.dirname(fileURLToPath(import.meta.url));
const assets = path.resolve(root, '../assets');
const names = ['moon-visit', 'sky-colour-explorer', 'hidden-cubes', 'bee-builder', 'otter-forest'];
const requested = process.argv.slice(2);
if (requested.some(name => !names.includes(name))) {
  throw new Error(`Choose an example: ${names.join(', ')}`);
}
const font = await fs.readFile(path.join(assets, 'fonts/Baloo2-variable.ttf'));
const fontLicense = await fs.readFile(path.join(assets, 'fonts/OFL.txt'), 'utf8');
const threeLicense = await fs.readFile(path.join(root, 'node_modules/three/LICENSE'), 'utf8');
const css = (await fs.readFile(path.join(assets, 'marble-ui.css'), 'utf8'))
  .replace('./fonts/Baloo2-variable.ttf', `data:font/ttf;base64,${font.toString('base64')}`);
const vocabulary = await fs.readFile(path.join(root, 'vocabulary.js'), 'utf8');
const output = path.join(root, 'dist');
await fs.mkdir(output, {recursive: true});
for (const name of requested.length ? requested : names) {
  const source = path.join(root, name, 'source');
  const bundle = await build({entryPoints: [path.join(source, 'app.js')],
    bundle: true, minify: true, format: 'iife', target: ['es2020'],
    write: false, legalComments: 'inline'});
  const script = bundle.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
  const styleNotices = name === 'bee-builder'
    ? '\n' + await fs.readFile(path.join(root, name, 'ANIDOODLE-NOTICE.txt'), 'utf8')
      + '\n' + await fs.readFile(path.join(root, name, 'ANIDOODLE-LICENSE.txt'), 'utf8')
    : '';
  const notices = `BALOO 2\n${fontLicense}\n${name === 'bee-builder' ? '' : `THREE.JS 0.180.0\n${threeLicense}`}${styleNotices}`;
  const html = (await fs.readFile(path.join(source, 'shell.html'), 'utf8'))
    .replace('__FONT__', () => font.toString('base64'))
    .replace('__CSS__', () => css)
    .replace('__VOCABULARY__', () => vocabulary.replace(/<\/script/gi, '<\\/script'))
    .replace('__APP__', () => script)
    .replace('</head>', () => `<script type="text/plain" id="asset-licenses">${notices}</script></head>`);
  await fs.writeFile(path.join(output, `${name}.html`), html);
  process.stdout.write(`Built dist/${name}.html\n`);
}
