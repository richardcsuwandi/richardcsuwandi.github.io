(function () {
  "use strict";
  const KEY = "treasure-hunt:visitor:v1";
  class TreasureHuntAPI {
    constructor(base) {
      this.base = base.replace(/\/$/, "");
      this.token = null;
      this.visitor = null;
      this.eventId = crypto.randomUUID();
      try {
        this.token = localStorage.getItem(KEY);
      } catch (_) {
        /* In-memory access still works. */
      }
    }
    async request(path, body, retry) {
      let response;
      try {
        response = await fetch(this.base + path, {
          method: body === undefined ? "GET" : "POST",
          headers: {
            ...(body === undefined ? {} : { "Content-Type": "application/json" }),
            ...(this.token ? { Authorization: "Bearer " + this.token } : {}),
          },
          ...(body === undefined ? {} : { body: JSON.stringify(body) }),
          signal: AbortSignal.timeout(15000),
          credentials: "omit",
        });
      } catch (error) {
        // Only authenticated, idempotent writes can be safely retried.
        if (retry && this.token) return this.request(path, body, false);
        throw new Error("The shared game could not be reached. Try again, or play a local practice map.");
      }
      const data = await response.json();
      if (!response.ok) {
        const error = new Error(data.error || "The shared game is temporarily unavailable.");
        error.status = response.status;
        throw error;
      }
      return data;
    }
    async checkIn(identity) {
      let data;
      try {
        data = await this.request("/v1/visits", { ...identity, eventId: this.eventId }, true);
      } catch (error) {
        if (error.status !== 401) throw error;
        this.token = null;
        data = await this.request("/v1/visits", { ...identity, eventId: this.eventId });
      }
      if (data.token) {
        this.token = data.token;
        try {
          localStorage.setItem(KEY, data.token);
        } catch (_) {
          /* Keep the token in memory. */
        }
      }
      this.visitor = data.visitor;
      return data.visitor;
    }
    start() {
      return this.request("/v1/runs", {}, true);
    }
    get(id) {
      return this.request("/v1/runs/" + id);
    }
    probe(id, x, y, requestId) {
      return this.request("/v1/runs/" + id + "/probes", { x, y, requestId }, true);
    }
    leaderboard() {
      return this.request("/v1/leaderboard");
    }
    activity() {
      return this.request("/v1/activity");
    }
  }
  window.TreasureHuntAPI = TreasureHuntAPI;
})();
