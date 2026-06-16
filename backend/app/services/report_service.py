from sqlalchemy import func

from app.db.database import SessionLocal
from app.models.transactions import Transaction

def yearly_turnover(year):
    db=SessionLocal()

    try:
        total_debits=(
            db.query(func.sum(Transaction.debit))
            .filter(
                func.extract(
                    "year",
                    Transaction.transaction_date
                )==year
            )
            .scalar()
        )

        total_credits=(
            db.query(func.sum(Transaction.credit))
            .filter(
                func.extract(
                    "year",
                    Transaction.transaction_date
                )==year
            )
            .scalar()
        )

        count=(
            db.query(Transaction)
            .filter(
                func.extract(
                    "year",
                    Transaction.transaction_date
                )==year
             ).count()
        )

        return {
            "year": year,
            "total_debits": total_debits or 0,
            "total_credits": total_credits or 0,
            "transaction_count": count
        }
    finally:
        db.close()