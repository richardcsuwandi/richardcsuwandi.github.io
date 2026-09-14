# UI enhancement notes

## Direction

Preserve the existing Inter typography, text colors, blue links, portrait, content width, and page structure. Adapt Motion Primitives' moving backgrounds and disclosures and Watermelon UI's progressive-detail patterns to the existing Jekyll site. No React runtime or new production JavaScript dependency is required.

## Changes

- Abstract and additional-author controls are native buttons with expanded state, controlled-panel references, keyboard support, and short disclosure transitions.
- Research, open-source projects, and news use compact lists with explicit Show all and Show fewer controls. Nested scrolling and wheel interception are removed from these lists.
- Project previews show six entries on desktop and three on narrow screens. Expanded collections stay expanded when resizing. Expansion moves keyboard focus to the first revealed item, while collapse retains focus on its control.
- Cursor-following glow, large hover lifts, and the whole-page entrance animation are removed. Section headings retain a short, opacity-only entrance, once per page visit.
- Existing moving navigation backgrounds remain, with shorter timing. Mobile navigation closes with Escape and returns focus to its toggle. It also closes when keyboard focus leaves the navigation.
- Native controls initialize after the page markup, before optional third-party libraries. They do not wait for unrelated deferred scripts.
- Abstracts, author names, and collection items remain readable without JavaScript. Reduced-motion preferences suppress the new transitions.

## Local preview

```sh
bundle exec jekyll serve
```

Open http://127.0.0.1:4000/.

## Browser regression tests

```sh
npm ci
npx playwright install chromium
npm run test:ui
```

Keep the Jekyll server running while testing. Playwright is a development-only dependency. Test files and output are excluded from the generated site.

The suite covers disclosures, rapid toggles, focus retention, compact lists, mobile navigation, reduced motion, no-JavaScript content access, a stalled optional script, and light/dark layouts at 320, 390, and 1280 pixels. It checks the original light-theme body and link colors and font family.

No publishing, git commits, or deployment is included in this pass.
