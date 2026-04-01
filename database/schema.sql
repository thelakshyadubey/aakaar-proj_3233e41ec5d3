CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title);