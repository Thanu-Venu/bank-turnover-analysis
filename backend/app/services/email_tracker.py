from app.db.database import SessionLocal
from app.models.processed_email import ProcessedEmail

def is_email_processed(message_id):
    db=SessionLocal()

    email=(
        db.query(ProcessedEmail)
        .filter(ProcessedEmail.message_id==message_id)
        .first()
    )

    db.close()

    return email is not None

def mark_email_processed(message_id):
    db=SessionLocal()

    email=ProcessedEmail(message_id=message_id)
    db.add(email)
    db.commit()
    db.close()
