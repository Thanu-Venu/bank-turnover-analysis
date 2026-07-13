from app.db.database import SessionLocal
from app.models.transactions import Transaction
from app.services.statement_processor import process_statement
import glob
from sqlalchemy import func

session = SessionLocal()
owner = 'venugoban1960@gmail.com'
start_date = '2025-05-02'
end_date = '2026-07-10'

print('Running full audit for owner:', owner)
print('Period:', start_date, 'to', end_date)

# DB totals within inclusive date range
db_q = session.query(func.count(Transaction.id), func.sum(Transaction.debit), func.sum(Transaction.credit)).filter(
    Transaction.owner_email == owner,
    Transaction.transaction_date >= start_date,
    Transaction.transaction_date <= end_date
)
count_db, total_debits_db, total_credits_db = db_q.one()
count_db = int(count_db or 0)
total_debits_db = float(total_debits_db or 0)
total_credits_db = float(total_credits_db or 0)
net_db = total_credits_db - total_debits_db

print('\nDB totals:')
print('transactions:', count_db)
print('total_debits:', total_debits_db)
print('total_credits:', total_credits_db)
print('net_flow:', net_db)

# Unowned rows in period
unowned_count = session.query(func.count(Transaction.id)).filter(
    (Transaction.owner_email == None) | (Transaction.owner_email == ''),
    Transaction.transaction_date >= start_date,
    Transaction.transaction_date <= end_date
).scalar()
print('\nunowned rows in period:', int(unowned_count or 0))

# Duplicate detection (exact match on key fields) across owner for period
dup_rows = session.query(
    Transaction.transaction_date,
    Transaction.description,
    Transaction.debit,
    Transaction.credit,
    func.count().label('dup_count')
).filter(
    Transaction.owner_email == owner,
    Transaction.transaction_date >= start_date,
    Transaction.transaction_date <= end_date
).group_by(
    Transaction.transaction_date, Transaction.description, Transaction.debit, Transaction.credit
).having(func.count() > 1).all()

dup_count = sum(int(r.dup_count) for r in dup_rows)
print('\nduplicate groups (exact matches):', len(dup_rows), 'total duplicate rows:', dup_count)

# Parser totals from local statements folder
parsed_count = 0
parsed_debits = 0.0
parsed_credits = 0.0
skipped_files = []

files = glob.glob('statements/*.pdf')
for f in files:
    txs = process_statement(f)
    if txs is None:
        skipped_files.append(f)
        continue
    parsed_count += len(txs)
    for t in txs:
        # parser returns dataclass Transaction with attributes
        if hasattr(t, 'debit'):
            parsed_debits += float(t.debit or 0)
            parsed_credits += float(t.credit or 0)
        else:
            # fallback for dict-like
            parsed_debits += float(t.get('debit') or 0)
            parsed_credits += float(t.get('credit') or 0)

print('\nLocal parsed PDFs:')
print('pdf files scanned:', len(files))
print('pdfs skipped (non-current):', len(skipped_files))
print('parsed transactions from PDFs:', parsed_count)
print('parsed total_debits:', parsed_debits)
print('parsed total_credits:', parsed_credits)
print('parsed net_flow:', parsed_credits - parsed_debits)

# Compare DB vs parsed
print('\nComparisons:')
print('DB transactions vs parsed transactions:', count_db, 'vs', parsed_count)
print('DB total_debits vs parsed debits:', total_debits_db, 'vs', parsed_debits)
print('DB total_credits vs parsed credits:', total_credits_db, 'vs', parsed_credits)

# Sample skipped files (up to 20)
print('\nSkipped files sample:')
for s in skipped_files[:20]:
    print('-', s)

session.close()
print('\nAudit complete')
