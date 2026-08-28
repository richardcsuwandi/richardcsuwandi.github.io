#!/usr/bin/env python3
"""Refresh stars/forks in _data/opensource.yml from the GitHub API.

Uses GITHUB_TOKEN when set (Actions provides one; locally: `gh auth token`).
Only the stars and forks lines are rewritten; everything else is left as-is.
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
YAML_PATH = ROOT / "_data" / "opensource.yml"
REPO_RE = re.compile(r'^(\s*)repo:\s*"([^"]+)"\s*$')
STARS_RE = re.compile(r"^(\s*)stars:\s*\d+\s*$")
FORKS_RE = re.compile(r"^(\s*)forks:\s*\d+\s*$")
GRAPHQL_URL = "https://api.github.com/graphql"
REST_URL = "https://api.github.com/repos/{repo}"


def github_headers() -> dict[str, str]:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "richardcsuwandi.github.io-stats",
    }
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def request_json(url: str, payload: dict | None = None) -> dict:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=github_headers(), method="GET" if data is None else "POST")
    if data is not None:
        req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def parse_repos(text: str) -> list[str]:
    repos: list[str] = []
    seen: set[str] = set()
    for line in text.splitlines():
        match = REPO_RE.match(line)
        if match:
            repo = match.group(2)
            if repo not in seen:
                seen.add(repo)
                repos.append(repo)
    return repos


def fetch_stats(repos: list[str]) -> dict[str, tuple[int, int]]:
    stats = fetch_stats_graphql(repos)
    missing = [repo for repo in repos if repo not in stats]
    for repo in missing:
        try:
            stats[repo] = fetch_stats_rest(repo)
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError, KeyError) as exc:
            print(f"warning: skipped {repo}: {exc}", file=sys.stderr)
    return stats


def fetch_stats_graphql(repos: list[str]) -> dict[str, tuple[int, int]]:
    aliases: list[tuple[str, str]] = []
    fields: list[str] = []
    for index, repo in enumerate(repos):
        owner, _, name = repo.partition("/")
        if not owner or not name:
            print(f"warning: invalid repo {repo!r}", file=sys.stderr)
            continue
        alias = f"r{index}"
        aliases.append((alias, repo))
        fields.append(
            f'{alias}: repository(owner: "{owner}", name: "{name}") '
            "{ stargazers { totalCount } forkCount }"
        )
    if not fields:
        return {}
    try:
        payload = request_json(GRAPHQL_URL, {"query": "query { " + " ".join(fields) + " }"})
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError) as exc:
        print(f"warning: GraphQL lookup failed: {exc}", file=sys.stderr)
        return {}
    if payload.get("errors") and not payload.get("data"):
        print(f"warning: GraphQL lookup failed: {payload['errors']}", file=sys.stderr)
        return {}
    data = payload.get("data") or {}
    stats: dict[str, tuple[int, int]] = {}
    for alias, repo in aliases:
        node = data.get(alias)
        if not node:
            print(f"warning: no GraphQL data for {repo}", file=sys.stderr)
            continue
        stars = node["stargazers"]["totalCount"]
        forks = node["forkCount"]
        stats[repo] = (int(stars), int(forks))
    return stats


def fetch_stats_rest(repo: str) -> tuple[int, int]:
    data = request_json(REST_URL.format(repo=repo))
    return int(data["stargazers_count"]), int(data["forks_count"])


def apply_stats(text: str, stats: dict[str, tuple[int, int]]) -> str:
    lines = text.splitlines()
    current_repo: str | None = None
    updated: list[str] = []
    for line in lines:
        match = REPO_RE.match(line)
        if match:
            current_repo = match.group(2)
            updated.append(line)
            continue
        if current_repo in stats:
            stars, forks = stats[current_repo]
            if STARS_RE.match(line):
                indent = STARS_RE.match(line).group(1)
                updated.append(f"{indent}stars: {stars}")
                continue
            if FORKS_RE.match(line):
                indent = FORKS_RE.match(line).group(1)
                updated.append(f"{indent}forks: {forks}")
                continue
        updated.append(line)
    return "\n".join(updated) + "\n"


def main() -> int:
    text = YAML_PATH.read_text(encoding="utf-8")
    repos = parse_repos(text)
    if not repos:
        print(f"error: no repos found in {YAML_PATH}", file=sys.stderr)
        return 1
    stats = fetch_stats(repos)
    if not stats:
        print("error: could not fetch any GitHub stats", file=sys.stderr)
        return 1
    new_text = apply_stats(text, stats)
    YAML_PATH.write_text(new_text, encoding="utf-8")
    for repo in repos:
        if repo in stats:
            stars, forks = stats[repo]
            print(f"{repo}: {stars} stars, {forks} forks")
    missing = [repo for repo in repos if repo not in stats]
    if missing:
        print("warning: left existing counts for " + ", ".join(missing), file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
