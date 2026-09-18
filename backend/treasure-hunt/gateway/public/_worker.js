// Keep scoring, secrets, and stored games in the existing Worker.
// The Pages hostname provides a reachable entry point without public workers.dev DNS.
export default {
  fetch(request, env) {
    return env.GAME.fetch(request);
  },
};
