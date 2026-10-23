# Capture notes

Opening captures refreshed 2026-10-21 from the unmodified `experience.html` snapshot in Chromium
through `file://`. Desktop captures are 1440 × 900; the narrow opening is
390 × 844. HTTP/HTTPS were blocked and offline emulation was enabled. The
embedded Baloo 2 loaded; the sampled paths had no script exceptions or runtime
remote requests. Browser actions reached these states; screenshots were inspected
for whole-scene composition and obvious clipping.

| Capture | State |
|---|---|
| [Opening](entry.png) | Richly illustrated central question and sole start action. |
| [Lesson entry](lesson-entry.png) | First practice screen after entering; retained from the preceding lesson revision. |
| [Interaction](interaction.png) | The central supported learning representation. |
| [Assessment](assessment.png) | A task with answer-revealing consequences withheld before commitment. |
| [Feedback](feedback.png) | A deliberately incorrect committed response followed by its visual consequence. |
| [Narrow](narrow.png) | Opening cover at phone width. |
| [Narrow lesson](narrow-lesson.png) | Prior fresh-phone lesson entry, retained for comparison. |

**Historical resize/mobile-emulation limitation:** the previous import showed that a fresh 390 × 844 load has a matching
390px layout/visual viewport and readable 17px title. Switching from desktop to
mobile in that earlier browser run retained a 1440px scroll/visual viewport and
scale it to 0.270833 despite a 390px document client width. Text then appears
tiny. [The failed resize capture](narrow-after-resize.png) is historical evidence from
the preceding revision;
[narrow.png](narrow.png) shows the normal fresh mobile load. This is evidence of
a viewport-transition issue, not proof that initial mobile loads fail or that
it is purely a harness artifact. Physical-device and orientation behavior remain
unverified.

Lesson-state captures were refreshed after the Earth/explorer redraw; the
opening and narrow captures were subsequently refreshed for the title screen. Earth and Moon now share matte scene lighting, with a
continuous curved falloff and near-black night side. The historical resize
capture is retained separately; the latest pass used a fresh phone load and did
not re-audit desktop-to-mobile transitions.

The sampled path turns Earth, changes to the observer's sky, follows the
light sequence and commits an incorrect visibility prediction. The feedback
toast duplicates the instruction in this snapshot; the design note explicitly
rejects copying that pattern. Cel-shaded landscape detail and shared viewpoint
geometry are useful references; illustrative solar effects are not the flat
material benchmark. These checks are not a full assessment-bank or accessibility
audit.

The portable build was also checked separately. Snapshots are unchanged from the
user's originals; source normalization changes dependency imports, not learning
logic. Build success and this limited browser pass do not establish educational
effectiveness, retention, physical-device performance or suitability for a
particular child. Revalidate after changing source or rebuilding an example.

The illustrated cover was additionally checked on desktop, phone and a short
landscape viewport. Keyboard and touch entry, isolation of lesson controls,
restart with cleared evidence, fresh entry and reduced motion were exercised.
For Moon, Sky and Cubes this also included 320px width and resize checks; Moon's
cover camera was revised to avoid clipping on short landscape screens. These
cover checks do not extend the earlier sampled lesson checks to the full task
bank or establish learning effectiveness.

Vocabulary support was added and captured on 2026-10-21. The dedicated
[vocabulary](vocabulary.png) and [phone vocabulary](vocabulary-narrow.png)
images show short, on-demand definitions in the actual lesson. Entry captures
were refreshed where the cover includes an underlined term. Hover, touch,
keyboard, dismissal, dynamic wording, button-action isolation and unchanged
assessment evidence were sampled; cube equation labels were checked in the
browser accessibility tree. The instruction popup position was refined to keep
the full sentence visible. Definitions inside the question cover remain usable
while underlying lesson controls are inert.

The dedicated vocabulary captures and the Bee/Cubes cover refresh show the latest
word-help affordances. Other lesson screenshots retain the preceding visual
revision and may omit dashed terms; open the current HTML for the live UI.


## Button vocabulary fix · 2026-10-23

The current standalone HTML excludes buttons and other action controls and their
labels from vocabulary annotation. Earlier captures on this page are historical
where they show word help on controls, including organism tokens.

Chrome checks passed with network disabled on `file://` at 1280 × 900 and
390 × 900 with touch emulation. Cover entry and lesson controls rendered without definition wrappers.
Word help still opened from non-interactive lesson text and closed with Escape.
Both readable helpers also passed native/ARIA button, nested-label, disabled and
dynamically created control checks, with mouse/touch actions and native-button
Enter/Space activation. No page script errors occurred.
Screenshots were inspected for the phone Bee Builder and desktop Hidden Cubes
layouts. The check script and all ten fresh captures are retained locally in
`/tmp/marble-browser-checks/check-button-vocabulary.mjs` and
`/tmp/marble-button-vocabulary/`. This was a focused control regression check,
not a full reassessment of learning outcomes.
