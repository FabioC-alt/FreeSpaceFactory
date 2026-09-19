# Handoff notes

This project was built with Claude Code and is being handed off to a different tool/assistant.
This document is the "start here" briefing: what this is, what's done, what's still open, and the
non-obvious things that cost time to discover the first time around. Technical setup/run
instructions live in [README.md](README.md) — this file is about context and status.

## What this project is

A rebuild of the website for **Free Space Factory**, an architecture studio in Rome run by two
architects, Flavia Rosano and Laura Gramaccini. The old site was WordPress (Inspiro theme +
Elementor) with weak SEO (every page shared one `<title>`, thin meta descriptions, a one-line
Contact page). This rebuild is a static [Astro](https://astro.build) site chosen specifically so
the client isn't maintaining a WordPress install, and so the site can score well on Core Web
Vitals/SEO out of the box.

The client (communicated through the person operating this tool, on behalf of the studio) is
non-technical from a web-dev standpoint but sends real business input: pricing sheets (.docx),
reference sites for inspiration, verbal instructions relayed from calls.

## Current status: functional, content mostly real

- All pages built and working: Home, Lo Studio, Architetti, Servizi, Chiavi in Mano (pricing
  packages), Progetti (8 real projects), Contatti, 404.
- Real content: page copy scraped from the live WordPress site, ~39 real project/team/logo photos
  downloaded from the live site (not placeholders), real logo icon extracted and recolored from
  the actual brand asset, real brand color (`#0f8a90`, a teal) extracted from the logo file itself
  — this replaced an initially-invented sage-green palette.
- Real pricing: the "Chiavi in Mano" package cards (Base €2.000 / Intermedio €4.500 / Luxury
  €6.000) come from two versions of a client-supplied `.docx` quote sheet (the second superseded
  the first with simplified wording — same prices, tighter copy). **These prices are explicitly
  provisional per the client** — see Open Items below.
- A working contact form (Web3Forms — no backend needed) is wired up but **not yet functional**
  until a real access key is added (see Open Items).
- The site currently runs two ways on this machine:
  - `npm run dev` (via `run-dev.cmd`, see below) for live-reloading local development.
  - A Docker container (`docker build -t freespacefactory .` then
    `docker run -d --name freespacefactory --restart unless-stopped -p 8081:80 freespacefactory`)
    serving a static production build at `http://localhost:8081`. This is a snapshot, not
    live-reloading — rebuild the image to pick up changes.
- Not yet deployed publicly. No production domain is pointed at anything yet.

## Open items — need client input, not just engineering

1. **Web3Forms access key.** The contact form on `/contatti/` posts to Web3Forms but
   `src/lib/constants.ts` still has a placeholder (`web3formsAccessKey: 'YOUR_WEB3FORMS_ACCESS_KEY'`).
   Someone needs to go to web3forms.com, enter `info@freespacefactory.it`, get the free key, and
   paste it in. Until then the form silently fails to deliver.
2. **Mail forwarding.** The client wants messages to `info@freespacefactory.it` to reach both
   architects ("mail globale" / mail forwarded to Flavia and Laura). That's an email-provider-side
   forwarding rule (Gmail/Aruba/whatever hosts that inbox), not something configurable in this
   codebase — flagged to the client, not done.
3. **Clitunno project article.** The client mentioned integrating "an article they made" about the
   Clitunno project into that project's page. No article text/link has been provided yet — nothing
   to integrate until it arrives.
4. **Package prices are provisional.** The client said as much directly ("potrebbero cambiare ma
   per ora vanno bene questi" — might change but these are fine for now). Confirm before treating
   the numbers in `src/pages/chiavi-in-mano.astro` as final.
5. **Studio's physical address.** Not published anywhere on the current site. If the studio sees
   clients in person, get the real address for `src/lib/constants.ts`
   (`addressLocality`/`addressRegion`) and for a Google Business Profile — this matters for local
   SEO (`LocalBusiness`/`Architect` schema currently has no `streetAddress`).
6. **02a.it-inspired redesign — how far to take it.** The client pointed at
   https://www.02a.it/ for inspiration. Concrete, low-risk things already borrowed: uppercase
   tracked headline treatment idea, denser photo-grid homepage concept (only partially applied —
   see below). NOT borrowed: 02a.it's long narrative per-project storytelling (materials, design
   rationale, anecdotes) — that would require real input from the architects about each project
   that hasn't been supplied, and fabricating it would misrepresent their actual work. If the
   client wants that editorial depth, someone needs to interview the architects per project.
7. **Project photo curation is partial.** For each of the 8 projects, 1 cover + 3-4 representative
   photos were downloaded from the old site, not the full original galleries (some projects had
   dozens of images split into "lavoro completato / cantiere / render" sub-galleries). If the
   client wants more photos per project, they're available on the still-live old site at
   freespacefactory.it — see the per-project image URLs that were originally sourced (not saved as
   a separate manifest; would need to re-browse the old site's project pages).

## Machine-specific gotchas (don't rediscover these the hard way)

This machine (Windows) had two environment problems that had nothing to do with the code, both
solved and documented in README.md, but worth knowing exist before assuming something's broken:

- **Node.js wasn't installed** at project start; it was installed via `winget install
  OpenJS.NodeJS.LTS`.
- **A Windows "Application Control" security policy blocks native `.node` binaries** that Astro 7
  depends on (Rust-based Markdown/JSX compilation via `satteri` and `@astrojs/compiler-binding`).
  The fix in place: WebAssembly fallback packages were manually vendored (npm refuses to install
  them automatically because their `cpu: wasm32` field never matches a real machine), and
  `NAPI_RS_FORCE_WASI=true` is set via `run-dev.cmd` before running Astro. Full detail and the
  recovery command (`npm run fix:native-blocked`) are in README.md. **This is very likely a
  machine-specific quirk** (corporate/managed-device security software) — don't assume it'll
  recur elsewhere, but don't be surprised if it does on this machine after a fresh `node_modules`.
  Note: this workaround is irrelevant inside the Docker container — Linux containers aren't
  subject to this Windows policy, so the Dockerfile builds cleanly with plain `npm install && npm
  run build`, no WASI flag needed there.

## Key decisions and why (so they aren't second-guessed for no reason)

- **Astro over WordPress or Next.js**: static output, no PHP/DB to secure, good SEO/performance
  defaults, simple enough for a non-technical maintainer to eventually hand Markdown files to
  someone for updates. Decided with the person operating this tool early on, not unilaterally.
- **Astro content collections** (`src/content/projects/*.md`) for projects specifically, but
  **plain inline arrays** for services and chiavi-in-mano packages (in the `.astro` page files
  themselves) — projects change/grow over time and benefit from one-file-per-item; the other two
  are small, fixed-size, rarely-changing lists where a content collection would be overkill.
  Don't "fix" this into consistency without a reason; it was a deliberate scope call. See
  `src/content.config.ts` for the projects schema.
- **Tailwind v4 via `@tailwindcss/vite`**, not `@astrojs/tailwind`: the latter's latest version
  still caps its `astro` peerDependency at `^5.0.0` and was effectively abandoned once Astro moved
  past v5, which forced this project onto the newer Vite-plugin-based integration anyway (also
  needed to get off Astro 5, which has multiple unpatched critical CVEs — see next point).
- **Astro pinned to `^7.3.2`, not `^5.x`**: `npm audit` on the originally-installed `astro@5.18.2`
  showed multiple critical/high CVEs (XSS via several vectors, an RCE via AVIF image optimization,
  SSRF) patched only in 7.3.2+. Don't downgrade without re-checking `npm audit`.
- **Web3Forms over a custom backend or plain `mailto:`**: this is a static site with no server;
  Web3Forms needs no account-with-password (just an emailed access key) and keeps the form as a
  real in-page form rather than punting to the visitor's own email client.
- **Local `/public/images/...` files, not Astro's `<Image>` optimization component**: simplicity —
  the existing `<img>`-based components didn't need to change, and the image set is small enough
  that unoptimized delivery isn't a real performance problem yet. Worth revisiting if many more
  photos get added.
- **Real photos over stock/placeholder**: earlier in the project, picsum.photos placeholders were
  used deliberately (client hadn't confirmed real-asset scope yet); once the client explicitly
  asked to pull real photos from the live site, they were downloaded and wired in project-by-project
  (see `src/content/projects/*.md`, `coverImage`/`gallery` fields point to `/images/projects/<slug>/`).

## Where things live (quick map)

- `src/content/projects/*.md` — one file per project; frontmatter = structured data (credits,
  gallery, status), body = the descriptive paragraph.
- `src/content.config.ts` — schema/validation for the above.
- `src/lib/constants.ts` — studio name, email, city, founders, nav links, Web3Forms key (placeholder).
- `src/layouts/BaseLayout.astro` — shared `<head>`: SEO tags, JSON-LD `Architect` schema, font
  loading.
- `src/components/Header.astro` — logo + nav; note the `xl:` (not `lg:`) breakpoint for switching
  to the mobile hamburger — this was deliberately widened after a real overlap bug at 1024px
  once a 7th nav item ("Chiavi in Mano") was added. Don't narrow it back without checking at
  1024–1279px.
- `src/pages/chiavi-in-mano.astro` — the pricing packages (see Open Items #4).
- `src/pages/contatti/index.astro` + `contatti/grazie.astro` — the contact form and its
  post-submit thank-you page.
- `Dockerfile`, `.dockerignore` — container build (see README.md "Deploy" section).
- `run-dev.cmd`, `scripts/fix-wasm-fallback.mjs` — Windows-machine-specific dev workarounds (see
  Gotchas above).
