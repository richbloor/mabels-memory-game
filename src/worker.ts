/// <reference types="@cloudflare/workers-types" />

interface Env {
  SCORES_DB: D1Database;
  ASSETS: Fetcher;
}

interface ScoreRow {
  name: string;
  time_ms: number;
}

const TOP_10_SQL = `SELECT name, time_ms FROM scores ORDER BY time_ms ASC LIMIT 10`;

function scoresResponse(rows: ScoreRow[]): Response {
  return Response.json(rows.map(r => ({ name: r.name, timeMs: r.time_ms })));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/scores') {
      if (request.method === 'GET') {
        const { results } = await env.SCORES_DB.prepare(TOP_10_SQL).all<ScoreRow>();
        return scoresResponse(results);
      }

      if (request.method === 'POST') {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 });
        }

        const { name, timeMs } = body as Record<string, unknown>;

        if (typeof name !== 'string' || !name.trim() || name.trim().length > 20) {
          return Response.json({ error: 'Invalid name' }, { status: 400 });
        }
        if (typeof timeMs !== 'number' || timeMs <= 0 || !Number.isInteger(timeMs)) {
          return Response.json({ error: 'Invalid time' }, { status: 400 });
        }

        await env.SCORES_DB.prepare('INSERT INTO scores (name, time_ms) VALUES (?, ?)')
          .bind(name.trim(), timeMs)
          .run();

        const { results } = await env.SCORES_DB.prepare(TOP_10_SQL).all<ScoreRow>();
        return scoresResponse(results);
      }

      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    return env.ASSETS.fetch(request);
  },
};
