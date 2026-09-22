const path = require("node:path");
const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const port = process.env.PORT || 3000;
const databasePath = process.env.DATABASE_PATH || path.join(__dirname, "marks.db");
const database = new Database(databasePath);

database.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    exam_id TEXT PRIMARY KEY,
    score REAL NOT NULL CHECK (score >= 0 AND score <= 100),
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(express.json({ limit: "32kb" }));

app.get("/api/scores", (request, response) => {
  const rows = database.prepare("SELECT exam_id, score FROM scores").all();
  const scores = Object.fromEntries(rows.map(row => [row.exam_id, row.score]));
  response.json({ scores });
});

app.put("/api/scores", (request, response) => {
  const scores = request.body?.scores;
  if (!scores || typeof scores !== "object" || Array.isArray(scores)) {
    return response.status(400).json({ error: "scores must be an object" });
  }

  const replaceScores = database.transaction(() => {
    database.prepare("DELETE FROM scores").run();
    const insert = database.prepare("INSERT INTO scores (exam_id, score) VALUES (?, ?)");
    for (const [examId, rawScore] of Object.entries(scores)) {
      const score = Number(rawScore);
      if (!examId || !Number.isFinite(score) || score < 0 || score > 100) {
        throw new Error("Each score must be a number from 0 to 100");
      }
      insert.run(examId, score);
    }
  });

  try {
    replaceScores();
    response.json({ ok: true });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

app.use(express.static(__dirname, { index: "marks.html" }));

app.listen(port, () => {
  console.log(`Marks tracker running at http://localhost:${port}`);
});
