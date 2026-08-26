# SYSTEMS/38

A working design-systems studio for comparing 38 visual languages, composing complete websites, saving project versions, and exporting deployable production files. SELF/FUNDING remains the complete research case study used to stress-test every system with long-form content, data, diagrams, tables, citations, and multi-page navigation.

## Live website

https://lovejzzz.github.io/Self-Funding-System/

The website is published from the root of the `main` branch. Research updates pushed to `main` are reflected in the public site after GitHub Pages finishes its deployment.

## Design Systems Laboratory

- [Studio](https://lovejzzz.github.io/Self-Funding-System/studio.html) — compose pages from semantic sections, edit real content, switch systems and preview desktop, tablet, or mobile.
- [Projects](https://lovejzzz.github.io/Self-Funding-System/projects.html) — create, resume, duplicate, import, and back up device-local website projects.
- [Systems Lab](https://lovejzzz.github.io/Self-Funding-System/systems.html) — inspect foundations, components, patterns, accessibility gates, motion and downloadable tokens for the active system.
- [Compare](https://lovejzzz.github.io/Self-Funding-System/compare.html) — lock one real page and compare three of the 38 systems side by side.
- [Visual Review](https://lovejzzz.github.io/Self-Funding-System/visual-review-2045.html) — switch the complete site between all 38 systems; Retro OS is the default.
- [SELF/FUNDING case study](https://lovejzzz.github.io/Self-Funding-System/case-study.html) — the original research homepage, preserved as a complete multi-page reference implementation.

Retro OS, Swiss Grid and Calm Futurism are the first production-candidate reference systems. The remaining 35 retain complete recipes and live specimens but are explicitly marked as documented drafts until they pass the same component, pattern and release gates.

### Project Studio

Projects begin from a name, short brief, design system, and set of starter pages. The Studio separates content from presentation: changing from Retro OS to Swiss Grid or another system does not rewrite the document. Ten semantic section types—Hero, Features, Stats, Split Story, Quote, Gallery, Pricing, Article, Call to Action, and Footer—can be added, duplicated, reordered, removed, and edited through explicit content fields.

Project state is autosaved locally in the browser. Named versions preserve up to 30 meaningful checkpoints and can restore the complete project, including its theme, pages, section order, and content. Projects can also be transferred through versioned JSON.

**Export website** creates an uncompressed, standards-compatible ZIP containing every HTML page, the shared production stylesheet, seven self-hosted WOFF2 font files, a machine-readable project manifest, and a handoff README. Studio, Visual Review, and Edit Mode controls are excluded from the production runtime. The package can be opened locally or deployed to any static host.

### Live Edit Mode

Reference and case-study pages include an **Edit page** control. Studio and Projects use their own purpose-built project controls instead. In edit mode, select any reference-page component to change its text or form value, typography, text/background color, opacity, borders, shadows, dimensions, spacing, layout, visibility, stacking, alignment, or position. The selection handle supports free dragging; the inspector also provides exact X/Y values, button nudges, and arrow-key movement.

The component navigator can search the entire page, move to a parent or child, copy and paste styles, and restore one component without resetting the whole experiment. All, Desktop, Laptop, and Mobile scopes create real breakpoint-specific overrides with a live preview. Canvas mode temporarily retracts the inspector while editing stays active, making direct selection practical on mobile and unobstructed on desktop.

The editor chrome is itself part of the active design system: typography, palette, geometry, borders, elevation, focus, and motion update with all 38 themes, with structural adaptations for strong languages such as Retro OS, Swiss Grid, Liquid Glass, terminal systems, editorial systems, and Manga. Edits are saved locally per page and per design system, so a customized Retro OS homepage does not alter Swiss Grid or another page. Undo, redo, per-component/page reset, and backward-compatible responsive JSON import/export are built in. Compare previews deliberately disable the editor to keep side-by-side evaluation isolated.

## Research

- [Public research journal](https://lovejzzz.github.io/Self-Funding-System/journal.html)
- [Research journal](research/JOURNAL.md)
- [Standing evidence review](research/foundations.md)
- [Stripe and agent identity](research/notes/2026-08-24T00-25-34Z-stripe-agent-identity.md)
