interface Env {
  SCORES_DB: D1Database;
}

interface ScoreRow {
  name: string;
  time_ms: number;
}

const TOP_10_SQL = `SELECT name, time_ms FROM scores ORDER BY time_ms ASC LIMIT 10`;

function toResponse(rows: ScoreRow[]): Response {
  const scores = rows.map(r => ({ name: r.name, timeMs: r.time_ms }));
  return Response.json(scores);
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.SCORES_DB.prepare(TOP_10_SQL).all<ScoreRow>();
  return toResponse(results);
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
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
  return toResponse(results);
};
