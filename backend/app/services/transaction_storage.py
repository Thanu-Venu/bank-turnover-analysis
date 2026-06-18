from app.db.database import SessionLocal
from app.models.transactions import Transaction

def save_transactions(transactions):
    db=SessionLocal()

    for tx in transactions:

        transaction=Transaction(
            transaction_date=tx.transaction_date,
            value_date=tx.value_date,
            description=tx.description,
            debit=tx.debit,
            credit=tx.credit,
            balance=tx.balance
        )
        db.add(transaction)

    db.commit()
    db.close()