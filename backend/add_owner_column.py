"""
Add `owner_email` column to `transactions` table if it doesn't exist.
Run this once after pulling changes: `python add_owner_column.py`
"""
from app.db.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    # SQLite/Postgres compatible check (uses IF NOT EXISTS for Postgres)
    try:
        conn.execute(text("ALTER TABLE transactions ADD COLUMN owner_email VARCHAR;"))
        print("Added owner_email column to transactions table.")
    except Exception as e:
        print("Could not add column (it may already exist):", e)
