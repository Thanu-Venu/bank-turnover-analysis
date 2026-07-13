from app.db.database import SessionLocal
from app.models.transactions import Transaction
from sqlalchemy import func

session = SessionLocal()
owner = 'venugoban1960@gmail.com'

print('Owner:', owner)

# Monthly aggregation for owner
rows = session.query(
    func.extract('year', Transaction.transaction_date).label('y'),
    func.extract('month', Transaction.transaction_date).label('m'),
    func.count().label('cnt'),
    func.sum(Transaction.debit).label('total_debits'),
    func.sum(Transaction.credit).label('total_credits')
).filter(Transaction.owner_email == owner).group_by('y', 'm').order_by('y', 'm').all()

print('\nMonthly aggregation (owner):')
for r in rows:
    print(f"{int(r.y)}-{int(r.m):02d}: count={int(r.cnt)}, debits={float(r.total_debits or 0):.2f}, credits={float(r.total_credits or 0):.2f}")

# Transactions for May 2026 for owner
print('\nTransactions for owner in May 2026:')
transactions = session.query(Transaction).filter(
    Transaction.owner_email == owner,
    Transaction.transaction_date >= '2026-05-01',
    Transaction.transaction_date < '2026-06-01'
).order_by(Transaction.transaction_date).all()

if not transactions:
    print('NONE')
else:
    for tx in transactions:
        print(tx.id, tx.transaction_date, tx.description, tx.debit, tx.credit, tx.balance)

# Unowned rows for May 2026
print('\nUnowned transactions count for May 2026:')
count_unowned = session.query(func.count()).filter(
    (Transaction.owner_email == None) | (Transaction.owner_email == ''),
    Transaction.transaction_date >= '2026-05-01',
    Transaction.transaction_date < '2026-06-01'
).scalar()
print(count_unowned)

session.close()
