from app.db.database import Base
from app.db.database import engine

from app.models.transactions import Transaction

Base.metadata.create_all(bind=engine)

print("Tables created successfully")