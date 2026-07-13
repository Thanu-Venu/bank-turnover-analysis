from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Date
from sqlalchemy import DateTime

from datetime import datetime

from app.db.database import Base

class Transaction(Base):
    __tablename__="transactions"
    id=Column(Integer,primary_key=True)

    transaction_date=Column(Date)
    value_date=Column(Date)
    description=Column(String)
    debit=Column(Float)
    credit=Column(Float)
    balance=Column(Float)
    owner_email=Column(String, nullable=True)
    created_at=Column(DateTime,default=datetime.utcnow)
