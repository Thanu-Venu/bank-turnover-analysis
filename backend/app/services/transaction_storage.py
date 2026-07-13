from app.db.database import SessionLocal
from app.models.transactions import Transaction

def save_transactions(transactions, owner_email=None):
    db=SessionLocal()
    inserted_count=0

    for tx in transactions:

        transaction=Transaction(
            transaction_date=tx.transaction_date,
            value_date=tx.value_date,
            description=tx.description,
            debit=tx.debit,
            credit=tx.credit,
            balance=tx.balance,
            owner_email=owner_email
        )
        existing=(
            db.query(Transaction)
            .filter(
                Transaction.transaction_date==tx.transaction_date,
                Transaction.value_date==tx.value_date,
                Transaction.description==tx.description,
                Transaction.debit==tx.debit,
                Transaction.credit==tx.credit,
                Transaction.balance==tx.balance
            )
            .first()
        )

        if existing:
            continue
        db.add(transaction)
        inserted_count +=1

    db.commit()
    db.close()

    return inserted_count