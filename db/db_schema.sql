CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    sender TEXT,
    receiver TEXT,
    details TEXT
);