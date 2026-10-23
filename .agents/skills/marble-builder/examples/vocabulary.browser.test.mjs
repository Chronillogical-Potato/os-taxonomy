import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {after, before, test} from 'node:test';
import {chromium} from 'playwright';

let browser;
before(async () => {
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  });
});
after(async () => { await browser?.close(); });

for (const helper of ['vocabulary.js', 'otter-forest/source/vocabulary.js']) {
  for (const touch of [false, true]) {
    test(`${helper}: controls stay actionable with ${touch ? 'touch' : 'mouse'}`, async () => {
      const context = await browser.newContext({
        viewport: {width: touch ? 390 : 1280, height: 900},
        hasTouch: touch, isMobile: touch, offline: true,
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const word = helper === 'vocabulary.js' ? 'cube' : 'otter';
      try {
        await page.setContent(`
          <p id="lesson">A ${word}.</p>
          <button id="native"><span>${word}</span></button>
          <div id="aria" role="button" tabindex="0"><span>${word}</span></div>
          <button disabled><span>${word}</span></button>
          <a href="#"><span>${word}</span></a>
          <label><span>${word}</span><input></label>
          <details><summary><span>${word}</span></summary></details>
        `);
        await page.evaluate(() => {
          window.actions = 0;
          document.addEventListener('click', event => {
            if (event.target.closest('#native, #aria, #dynamic')) window.actions++;
          });
        });
        await page.addScriptTag({content: await readFile(new URL(helper, import.meta.url), 'utf8')});
        const controls = 'button,[role=button]:not(.vocab-term),a,label,summary';
        const checkControls = async () => {
          assert.equal(await page.locator(controls).locator('.vocab-term').count(), 0);
          assert.equal(await page.locator('#vocab-popover').isVisible(), false);
        };
        await checkControls();
        for (const id of ['native', 'aria']) {
          await page.locator(`#${id} span`).hover();
          await checkControls();
          if (touch) await page.locator(`#${id} span`).tap();
          else await page.locator(`#${id} span`).click();
        }
        assert.equal(await page.evaluate(() => window.actions), 2);
        await page.locator('#native').focus();
        await checkControls();
        await page.keyboard.press('Enter');
        await page.keyboard.press('Space');
        assert.equal(await page.evaluate(() => window.actions), 4);
        await page.evaluate(word => {
          document.querySelector('#native span').textContent = word + ' ' + word;
          const button = document.createElement('button');
          button.id = 'dynamic';
          const label = document.createElement('strong');
          label.textContent = word;
          button.append(label);
          document.body.append(button);
          document.querySelector('#lesson').textContent = 'Another ' + word + '.';
        }, word);
        // Await observer-driven wrapping in the changed prose before checking new controls.
        await page.waitForFunction(() => document.querySelector('#lesson .vocab-term'));
        await checkControls();
        if (touch) await page.locator('#dynamic strong').tap();
        else await page.locator('#dynamic strong').click();
        assert.equal(await page.evaluate(() => window.actions), 5);
        const term = page.locator('#lesson .vocab-term');
        if (touch) await term.tap();
        else await term.click();
        assert.equal(await page.locator('#vocab-popover').isVisible(), true);
        assert.ok((await page.locator('#vocab-definition').innerText()).length > 10);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#vocab-popover').isVisible(), false);
        assert.deepEqual(errors, []);
      } finally {
        await context.close();
      }
    });
  }
}
