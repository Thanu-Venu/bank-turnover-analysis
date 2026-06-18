from app.services.email_tracker import is_email_processed,mark_email_processed

message_id="test123"

print(
    "Before:",
    is_email_processed(message_id)
)

mark_email_processed(message_id)

print(
    "After:",
    is_email_processed(message_id)
)