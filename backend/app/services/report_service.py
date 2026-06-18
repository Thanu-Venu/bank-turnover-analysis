from sqlalchemy import func
from app.db.database import SessionLocal
from app.models.transactions import Transaction
from sqlalchemy import extract

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

def get_monthly_report(year,month):
    db=SessionLocal()

    transactions=(
        db.query(Transaction)
        .filter(
            extract("year",Transaction.transaction_date)==year,
            extract("month",Transaction.transaction_date)==month
        )
        .all()
    )

    total_debits=sum(
        tx.debit for tx in transactions
    )

    total_credits=sum(
        tx.credit for tx in transactions
    )

    report={
        "year":year,
        "month":month,
        "total_debits":total_debits,
        "total_credits":total_credits,
        "transaction_count":len(transactions)
    }

    db.close()
    return report

def get_dashboard_summary():
    db=SessionLocal()
    total_transactions=(
        db.query(Transaction).count()
    )

    total_debits=(
        db.query(func.sum(Transaction.debit)).scalar() or 0
    )

    total_credits=(
        db.query(func.sum(Transaction.credit)).scalar() or 0
    )

    first_transaction=(
        db.query(
            func.min(
                Transaction.transaction_date
            )
        )
        .scalar()
    )

    last_transaction=(
        db.query(
            func.max(
                Transaction.transaction_date
            )
        )
        .scalar()
    )

    db.close()

    return{
        "total_transactions":total_transactions,
        "total_debits":total_debits,
        "total_credits":total_credits,
        "net_flow":total_credits-total_debits,
        "first_transaction":first_transaction,
        "last_transaction":last_transaction
    }

def get_monthly_trend():
    db=SessionLocal()

    results=(
        db.query(
            func.date_trunc(
                "month",
                Transaction.transaction_date
            ).label("month"),
            func.sum(Transaction.debit).label("total_debits"),
            func.sum(Transaction.credit).label("total_credits")
        )
        .group_by("month")
        .order_by("month")
        .all()
    )

    trend=[]

    for row in results:
        trend.append({
            "month": row.month.strftime("%Y-%m"),
            "total_debits":float(row.total_debits or 0),
            "total_credits": float(row.total_credits or 0)
        })

    db.close()
    return trend

def get_recent_transactions(limit=10):
    db=SessionLocal()

    transactions=(
        db.query(Transaction)
        .order_by(Transaction.transaction_date.desc())
        .limit(limit)
        .all()
    )

    recent=[]

    for tx in transactions:
        recent.append({
            "transaction_date": tx.transaction_date,
            "value_date": tx.value_date,
            "description": tx.description,
            "debit": tx.debit,
            "credit": tx.credit,
            "balance": tx.balance
        })

    db.close()
    return recent