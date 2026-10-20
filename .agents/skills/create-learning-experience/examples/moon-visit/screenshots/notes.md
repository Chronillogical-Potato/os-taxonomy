# Capture notes

Captured 2026-10-20 from the unmodified `experience.html` snapshot in Chromium
through `file://`. Desktop captures are 1440 × 900; the narrow opening is
390 × 844. HTTP/HTTPS were blocked and offline emulation was enabled. The
embedded Baloo 2 loaded; the sampled paths had no script exceptions or runtime
remote requests. Browser actions reached these states; screenshots were inspected
for whole-scene composition and obvious clipping.

| Capture | State |
|---|---|
| [Opening](entry.png) | Entry composition and available first action. |
| [Interaction](interaction.png) | The central supported learning representation. |
| [Assessment](assessment.png) | A task with answer-revealing consequences withheld before commitment. |
| [Feedback](feedback.png) | A deliberately incorrect committed response followed by its visual consequence. |
| [Narrow](narrow.png) | Entry at phone width, not a full mobile-flow audit. |

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

The five main captures were refreshed from the latest local HTML after the
Earth/explorer redraw. Earth and Moon now share matte scene lighting, with a
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
