from sqlalchemy import Column,Integer,String
from app.db.database import Base,engine

class ProcessedEmail(Base):
    __tablename__="processed_emails"
    id=Column(Integer,primary_key=True)
    message_id=Column(String,unique=True)

Base.metadata.create_all(bind=engine)

print("Processed Emails table created successfully.")