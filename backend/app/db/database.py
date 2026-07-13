from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Read database URL from environment for Docker compatibility
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://admin:password123@localhost:5432/turnoverdb",
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()