from app.db.database import SessionLocal
from app.models.transactions import Transaction
from sqlalchemy import func

session = SessionLocal()
owner = 'venugoban1960@gmail.com'
start_date = '2026-03-01'
end_date = '2026-06-01'  # exclusive

print(f"Assigning owner {owner} to transactions from {start_date} to {end_date} (exclusive) where owner is NULL/empty")

q = session.query(Transaction).filter(
    (Transaction.owner_email == None) | (Transaction.owner_email == ''),
    Transaction.transaction_date >= start_date,
    Transaction.transaction_date < end_date
)

count = q.count()
print('Rows matched:', count)

if count > 0:
    updated = q.update({Transaction.owner_email: owner}, synchronize_session=False)
    session.commit()
    print('Rows updated:', updated)
else:
    print('Nothing to update')

# report new counts per month
rows = session.query(
    func.extract('year', Transaction.transaction_date).label('y'),
    func.extract('month', Transaction.transaction_date).label('m'),
    func.count().label('cnt')
).filter(Transaction.owner_email == owner,
         Transaction.transaction_date >= start_date,
         Transaction.transaction_date < end_date
).group_by('y', 'm').order_by('y', 'm').all()

print('\nPost-update counts for owner:')
for r in rows:
    print(f"{int(r.y)}-{int(r.m):02d}: count={int(r.cnt)}")

session.close()
