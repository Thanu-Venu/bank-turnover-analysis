from app.db.database import SessionLocal
from app.models.transactions import Transaction
from sqlalchemy import func

session = SessionLocal()
owner = 'venugoban1960@gmail.com'
start_date = '2025-05-02'
end_date = '2026-07-10'

print(f"Assigning owner {owner} to unowned transactions between {start_date} and {end_date}")
q = session.query(Transaction).filter(
    (Transaction.owner_email == None) | (Transaction.owner_email == ''),
    Transaction.transaction_date >= start_date,
    Transaction.transaction_date <= end_date
)
count = q.count()
print('matched:', count)
if count:
    updated = q.update({Transaction.owner_email: owner}, synchronize_session=False)
    session.commit()
    print('updated:', updated)
else:
    print('nothing to update')

session.close()
