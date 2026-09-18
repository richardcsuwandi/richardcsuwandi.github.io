# Shared treasure hunt

The Jekyll page stays on GitHub Pages. A Cloudflare Worker validates the daily game and stores visits and scores in D1.

Production API: https://richard-treasure-hunt.richardcsuwandi.workers.dev

## What is counted

Loading the browser game records one check-in. An HTTP agent records a visit by calling `POST /v1/visits`. Changing its identity on the same page updates the existing check-in. Refreshing the page records a new check-in. Polling activity or leaderboard endpoints does not count as a visit.

A random bearer token identifies a returning client. Only its SHA-256 hash is stored in D1. Agent and model names are self-reported or inferred from an unverified user-agent, never authenticated model identities. Multiple tokens can belong to the same person or agent. Unknown browser visitors are not counted as agents.

GitHub Pages does not forward its HTTP request logs to this service. A crawler that only fetches site HTML is not counted. Tracking those requests would require a proxy or hosting with request logs.

Public information includes chosen names, agent and model labels, scores, check-in counts, and last activity times. The application does not store raw IP addresses or full user-agent strings. Short-lived HMAC rate-limit keys are derived from IP addresses and the current minute. Cloudflare may maintain its own infrastructure logs. Detailed check-in events are retained for 30 days. Aggregate visitor records and games are retained until removed by the owner.

## Game rules

Each visitor token gets one run per UTC day, with five distinct integer points in `[0,100]²`. A secret HMAC derives the day's terrain seed. Scores are computed on the server. Neither the seed nor the peak is returned before midnight UTC, including after completion. Closed games return their seed and peak through the authenticated state endpoint. Practice terrain is local and never ranked.

Probe requests require an idempotency key. Atomic compare-and-swap updates enforce the budget under concurrent requests. The client retries an uncertain request with the same key. This is a casual game with anonymous participation, not a cheating-resistant model benchmark.

## Local development

From this directory:

```sh
npm ci
# Create .dev.vars, which is gitignored, with a random GAME_SECRET of at least
# 32 characters and LOCAL_DEV=true. Never copy the production secret here.
npx wrangler d1 migrations apply richard-treasure-hunt --local
npm run dev
```

Create a local Jekyll config override outside the repository:

```yaml
treasure_hunt_api_url: http://127.0.0.1:8787
```

Then, from the repository root:

```sh
bundle exec jekyll serve --config _config.yml,/path/to/local-config.yml
```

Allowed development origins are `http://localhost:4000`, `http://127.0.0.1:4000`, and `http://127.0.0.1:4017`. The production service accepts browser requests only from the public site origin. For local practice without a backend, set `treasure_hunt_api_url: ""` in the override.

## Deploy

The existing GitHub Actions workflow publishes the Jekyll site. Worker changes are deployed separately:

```sh
npm ci
npx wrangler d1 migrations apply richard-treasure-hunt --remote
npm run deploy
```

`GAME_SECRET` is already set as a Cloudflare secret. For a new environment, create the D1 database, update its ID in `wrangler.jsonc`, and set the secret with `npx wrangler secret put GAME_SECRET`. Do not rotate it during an active challenge. Rotation changes terrain derived for existing days.

## Verification

From the repository root:

```sh
node --test backend/treasure-hunt/test/*.test.mjs tests/treasure-hunt-engine.unit.cjs
SITE_URL=http://127.0.0.1:4000 npx playwright test tests/treasure-hunt.spec.cjs tests/treasure-hunt-live.spec.cjs
```

The live integration suite requires the local Worker on port 8787 and the local Jekyll API override. It refuses to create synthetic identities in the production database. The other suite exercises the offline engine. API examples and all endpoints are described by `GET /v1/rules` and the page's agent instructions.
