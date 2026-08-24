# 38-Style Design Audit Response

Date: 2026-08-24  
External review: [Claude audit artifact](https://claude.ai/code/artifact/2c5b6149-938b-44ba-a6e5-a22323d77c9c)

The external audit was treated as a set of hypotheses and checked against the running multi-page site at laptop and mobile sizes. Confirmed issues were repaired in the shared design contract first, then with narrow theme-specific overrides where the visual language required them.

## Shared corrections

- Added separate tokens for accent fills and accent text. A bright or branded accent may no longer be assumed to be readable as text.
- Raised low-emphasis text contrast without flattening hierarchy.
- Replaced hard-coded hero, quote, status, data-tag, and flow-node colors with theme-aware surfaces and ink.
- Self-hosted four font families and assigned deliberate display, body, label, and data roles across all 38 styles.
- Kept the desktop selector wrapped, as required by the product brief, but removed it from the persistent sticky stack. On mobile it becomes one compact horizontal row with a separate Recipe control.
- Increased chip size and corrected active, hover, focus, and animated transition contrast.
- Added narrow-stage placement rules for hero data labels and responsive flow diagrams.
- Added a seventh, theme-specific Journal navigation label to every style.
- Expanded every recipe with typography delivery, contrast pairs, responsive visualization behavior, motion behavior, and accent-ink rules.

## Theme-specific corrections

- Research Archive: restored centered page margins and readable quote/document colors.
- Swiss Grid: removed the narrow research-note sliver and restored full-grid scope.
- Finance Terminal: replaced the fragile orbital flow diagram with a ledger/grid flow on desktop and mobile.
- Solarpunk: replaced inherited dark status and flow surfaces with regenerative light surfaces.
- Monochrome: repaired black-on-black accent cards and dark data tags.
- Retro OS: rebuilt the timeline and footer as readable gray window surfaces on the teal desktop.
- Whitepaper: removed duplicate automatic section numbering.
- Protocol, Clay, Newspaper, Memphis, Biotech, Museum, Industrial, Holographic, and Cartographic: corrected the specific headline, muted-copy, selector, or accent-state contrast failures found during verification.

## Verification completed

- 28 themes at 1440 × 900: no horizontal overflow; all shared flow maps are collision-free.
- 28 themes at 390 × 844: no horizontal overflow; no selector/Recipe overlap; no hero data-tag or flow-node collisions.
- All seven content pages and three standalone previews: 28 selector options, seven navigation destinations, loaded fonts, working recipe panel, and no missing local links.
- Theme persistence verified across normal pages and standalone previews.
- All 28 recipe panels verified to contain ten displayed color roles and a complete company-scale design-system skill.

The desktop selector was intentionally not collapsed into a dropdown or single-row scroller because the visual-review brief explicitly requires all 38 directions to remain visible and wrapped on laptop/desktop.

## Systems 29–38

- Added Bento Product, Risograph, Kinetic Type, Spatial OS, Quiet Luxury, Civic Digital, Parametric, Web Vernacular, Aero Optimism, and Manga Systems.
- Each system owns a distinct editorial model, page composition, typography stack, treasury behavior, component grammar, inner-page treatment, motion choreography, and governance gate.
- The new systems were verified with the same shared persistence, recipe, contrast, overflow, and runtime contracts as systems 01–28, then reviewed together as homepage and Architecture contact sheets at 1280px.

## Round-two corrections

- Replaced the leaked base dark callout treatment in Monochrome, Japanese Minimal, and Solarpunk with explicit callout surface, heading, paragraph, micro-label, and action ink pairs.
- Corrected the Monochrome Architecture inverse metric, Neo-Brutalist center labels, and light-theme micro-labels so their text follows the component surface rather than the page accent color.
- Added a separate `accent-ink` contract for Neo-Brutalist, Memphis, Calm Futurism, Clay, and Swiss Grid; adjusted Bauhaus, Solarpunk, Swiss, Memphis, Biotech, Cartographic, and Terminal hairline contrast pairs.
- Mobile theme persistence now horizontally centers the active chip without changing the page's vertical position.
- Expanded all 38 recipes from art-direction summaries into company-scale design-system specifications. Every system now defines a numeric type scale, grid, spacing scale, surface/elevation logic, imagery and iconography, data visualization, financial notation, motion, accessibility, internationalization, component-state inventory, required deliverables, ownership, versioning, migration, and release gates.
- Each copied design-system skill includes the selected theme's live token values and requires paired surface/text tokens, six viewport regression fixtures, WCAG 2.2 AA, and human review of every text/background relationship.
