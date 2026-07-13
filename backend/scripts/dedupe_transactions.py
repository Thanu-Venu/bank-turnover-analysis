from app.db.database import SessionLocal
from app.models.transactions import Transaction
from sqlalchemy import func

session = SessionLocal()
owner = 'venugoban1960@gmail.com'
start_date = '2025-05-02'
end_date = '2026-07-10'

print('Deduplicating exact matches for owner in period')
# find groups with count>1
groups = session.query(
    Transaction.transaction_date,
    Transaction.description,
    Transaction.debit,
    Transaction.credit,
    Transaction.balance,
    func.count().label('cnt')
).filter(
    Transaction.owner_email == owner,
    Transaction.transaction_date >= start_date,
    Transaction.transaction_date <= end_date
).group_by(
    Transaction.transaction_date,
    Transaction.description,
    Transaction.debit,
    Transaction.credit,
    Transaction.balance
).having(func.count() > 1).all()

print('duplicate groups found:', len(groups))

deleted_total = 0
for g in groups:
    txs = session.query(Transaction).filter(
        Transaction.owner_email == owner,
        Transaction.transaction_date == g.transaction_date,
        Transaction.description == g.description,
        Transaction.debit == g.debit,
        Transaction.credit == g.credit,
        Transaction.balance == g.balance
    ).order_by(Transaction.id).all()

    # keep the first, delete rest
    keep = txs[0]
    to_delete = txs[1:]
    ids = [t.id for t in to_delete]
    if ids:
        session.query(Transaction).filter(Transaction.id.in_(ids)).delete(synchronize_session=False)
        deleted_total += len(ids)

session.commit()
print('deleted duplicate rows:', deleted_total)
session.close()
