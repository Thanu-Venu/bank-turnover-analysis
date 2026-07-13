from sqlalchemy import func
from app.db.database import SessionLocal
from app.models.transactions import Transaction
from sqlalchemy import extract

def yearly_turnover(year, owner_email=None):
    def _query_with_owner(q, owner_email):
        if owner_email:
            return q.filter(Transaction.owner_email == owner_email)
        return q

    db=SessionLocal()

    try:
        total_debits=(
            _query_with_owner(db.query(func.sum(Transaction.debit)), owner_email)
            .filter(
                func.extract(
                    "year",
                    Transaction.transaction_date
                )==year
            )
            .scalar()
        )

        total_credits=(
            _query_with_owner(db.query(func.sum(Transaction.credit)), owner_email)
            .filter(
                func.extract(
                    "year",
                    Transaction.transaction_date
                )==year
            )
            .scalar()
        )

        count=(
            _query_with_owner(db.query(Transaction), owner_email)
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

def get_monthly_report(year,month, owner_email=None):
    db=SessionLocal()

    q = db.query(Transaction)
    if owner_email:
        q = q.filter(Transaction.owner_email == owner_email)

    transactions=(
        q.filter(
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

def get_dashboard_summary(owner_email=None):
    db=SessionLocal()

    q = db.query(Transaction)
    if owner_email:
        q = q.filter(Transaction.owner_email == owner_email)

    total_transactions=(
        q.count()
    )

    total_debits=(
        q.with_entities(func.sum(Transaction.debit)).scalar() or 0
    )

    total_credits=(
        q.with_entities(func.sum(Transaction.credit)).scalar() or 0
    )

    first_transaction=(
        q.with_entities(func.min(Transaction.transaction_date)).scalar()
    )

    last_transaction=(
        q.with_entities(func.max(Transaction.transaction_date)).scalar()
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

def get_monthly_trend(owner_email=None):
    db=SessionLocal()

    q = db.query(
            func.date_trunc(
                "month",
                Transaction.transaction_date
            ).label("month"),
            func.sum(Transaction.debit).label("total_debits"),
            func.sum(Transaction.credit).label("total_credits")
        )

    if owner_email:
        q = q.filter(Transaction.owner_email == owner_email)

    results=(
        q.group_by("month")
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

def get_recent_transactions(limit=10, owner_email=None):

    db = SessionLocal()

    q = db.query(Transaction)
    if owner_email:
        q = q.filter(Transaction.owner_email == owner_email)

    transactions = (
        q.order_by(
            Transaction.transaction_date.desc()
        )
        .limit(limit)
        .all()
    )

    result = []

    for tx in transactions:

        result.append(
            {
                "date": tx.transaction_date,
                "description": tx.description,
                "debit": tx.debit,
                "credit": tx.credit,
                "balance": tx.balance
            }
        )

    db.close()

    return result