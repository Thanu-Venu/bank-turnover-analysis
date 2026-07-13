from datetime import datetime

from app.db.database import SessionLocal
from app.models.transactions import Transaction as TransactionModel

def save_transactions(transactions, owner_email=None):
    db=SessionLocal()

    try:
        for transaction in transactions:

            db_transaction=TransactionModel(
                transaction_date=datetime.strptime(
                    transaction.transaction_date,
                    "%d-%b-%Y"
                ).date(),
                value_date=datetime.strptime(
                    transaction.value_date,
                    "%d-%b-%Y"
                ).date(),
                description=transaction.description,
                debit=transaction.debit,
                credit=transaction.credit,
                balance=transaction.balance
            )
            db_transaction.owner_email = owner_email

            db.add(db_transaction)
        db.commit()
    finally:
        db.close()