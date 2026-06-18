from sqlalchemy import Column,Integer,String
from app.db.database import Base

class ProcessedEmail(Base):
    __tablename__="processed_emails"
    id=Column(Integer,primary_key=True)
    message_id=Column(String,unique=True)