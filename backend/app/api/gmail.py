from fastapi import APIRouter
from starlette.requests import Request
from app.services.gmail_service import get_gmail_service,get_message_details,get_message,download_attachment
from app.services.statement_processor import process_statement
from app.services.transaction_storage import save_transactions
from app.services.email_tracker import(is_email_processed,mark_email_processed)
from app.db.database import SessionLocal
from app.models.processed_email import ProcessedEmail

router=APIRouter()

@router.get("/gmail/test")
async def gmail_test(request:Request):
    token=request.session.get("token")
    if not token:
        return {
            "error":"Not authenticated"
        }
    return{
        "message":"Token found",
        "token_type":token.get("token_type")
    }

@router.get("/gmail/messages")
async def get_messages(request:Request):
    token=request.session.get("token")

    if not token:
        return{
            "error":"Not authenticated"
        }
    service=get_gmail_service(token)

    results=(
        service.users()
        .messages()
        .list(userId="me", maxResults=10)
        .execute()
    )

    messages= results.get("messages",[])

    email_list=[]
    for msg in messages:
        full_message=get_message_details(
            service,msg["id"]
        )

        headers=full_message["payload"]["headers"]

        subject=""
        sender=""

        for header in headers:
            if header["name"]=="Subject":
                subject=header["value"]
            elif header["name"]=="From":
                sender=header["value"]

        email_list.append({
            "subject":subject,
            "from":sender
        })

    return email_list

@router.get("/gmail/ndb-statements")
async def get_ndb_statements(request:Request):
    token=request.session.get("token")

    if not token:
        return{
            "error":"Not authenticated"
        }

    service=get_gmail_service(token)

    results=(
        service.users()
        .messages()
        .list(
            userId="me",
            q="from:estatements@ndbbank.com"
        )
        .execute()
    )
    return results

@router.get("/gmail/ndb-first")

async def get_first_ndb_email(request:Request):
    token=request.session.get("token")

    if not token:
        return{
            "error":"Not authenticated"
        }

    service=get_gmail_service(token)

    results=(
        service.users()
        .messages()
        .list(
            userId="me",
            q="from:estatements@ndbbank.com"
        )
        .execute()
    )

    first_message_id=results["messages"][0]["id"]

    message=get_message(
        service,
        first_message_id
    )

    for part in message["payload"]["parts"]:
        if part.get("filename"):
            attachment_id=(
                part["body"]["attachmentId"]
            )

            pdf_data=download_attachment(
                service,
                first_message_id,
                attachment_id
            )

            filename=part["filename"]
            with open(
                f"statements/{filename}",
                "wb"
            ) as f:
                f.write(pdf_data)

            transactions = process_statement(f"statements/{filename}")

            return {
                "filename":filename,
                "transactions_found":len(transactions)
            }


    return message

@router.get("/gmail/process-all")
async def process_all_statements(request:Request):
    token=request.session.get("token")

    if not token:
        return{
            "error":"Not authenticated"
        }

    # require a logged-in user so imported transactions are attributed
    user = request.session.get("user")
    if not user:
        return {"error": "Must be logged in to run processing (owner attribution required)"}

    service = get_gmail_service(token)

    # paginate through all messages matching the query to collect every statement
    all_messages = []
    next_token = None
    # limit to May 2025 through July 2026
    query = "from:estatements@ndbbank.com after:2025/05/01 before:2026/08/01"
    while True:
        params = {"userId": "me", "q": query}
        if next_token:
            params["pageToken"] = next_token
        results = service.users().messages().list(**params).execute()
        msgs = results.get("messages", [])
        all_messages.extend(msgs)
        next_token = results.get("nextPageToken")
        if not next_token:
            break

    total_emails_found = len(all_messages)
    processed_count = 0
    skipped_count = 0
    transaction_count = 0
    pdfs_downloaded = 0
    pdfs_parsed = 0
    pdfs_skipped = 0
    skipped_details = []

    print(f"Found {total_emails_found} matching emails")

    for msg in all_messages:
        message_id = msg["id"]

        if is_email_processed(message_id):
            skipped_count += 1
            skipped_details.append({"message_id": message_id, "reason": "already_processed"})
            continue

        message = get_message(service, message_id)

        payload = message.get("payload", {}) or {}

        def collect_parts(part):
            parts = []
            if not part:
                return parts
            if part.get("filename") or part.get("body"):
                parts.append(part)
            for p in part.get("parts", []) or []:
                parts.extend(collect_parts(p))
            return parts

        parts = collect_parts(payload)

        found_pdf_for_message = False
        parsed_for_message = 0
        saved_for_message = 0

        for part in parts:
            filename = (part.get("filename") or "").strip()
            mime = part.get("mimeType") or ""
            body = part.get("body") or {}
            attachment_id = body.get("attachmentId")
            inline_data = body.get("data")

            is_pdf = False
            if filename and filename.lower().endswith(".pdf"):
                is_pdf = True
            elif mime and mime.lower() == "application/pdf":
                is_pdf = True

            if not is_pdf:
                continue

            found_pdf_for_message = True
            pdfs_downloaded += 1
            safe_name = filename.replace("/", "_") if filename else f"{message_id}.pdf"
            pdf_path = f"statements/{safe_name}"

            try:
                if attachment_id:
                    pdf_data = download_attachment(service, message_id, attachment_id)
                elif inline_data:
                    import base64
                    pdf_data = base64.urlsafe_b64decode(inline_data)
                else:
                    raise ValueError("no attachment data")

                with open(pdf_path, "wb") as f:
                    f.write(pdf_data)
            except Exception as e:
                pdfs_skipped += 1
                skipped_details.append({"message_id": message_id, "filename": filename, "reason": f"download_failed: {e}"})
                continue

            transactions = process_statement(pdf_path)

            if transactions is None:
                pdfs_skipped += 1
                skipped_details.append({"message_id": message_id, "filename": safe_name, "reason": "non_current_format"})
                mark_email_processed(message_id)
                skipped_count += 1
                continue

            pdfs_parsed += 1
            parsed_for_message = len(transactions)
            # owner_email is always taken from the logged-in user (we validated above)
            owner_email = user.get("email")
            saved = save_transactions(transactions, owner_email=owner_email)
            saved_for_message = saved
            transaction_count += saved

        # decide whether to mark the email processed: if any PDF found (even if parsing yielded 0 saves), mark processed
        if found_pdf_for_message:
            mark_email_processed(message_id)
            processed_count += 1
            print(f"Processed message {message_id}: parsed={parsed_for_message} saved={saved_for_message}")
        else:
            # no PDF attachment found
            skipped_details.append({"message_id": message_id, "reason": "no_pdf_attachment"})
            pdfs_skipped += 1
            skipped_count += 1

    # final summary
    summary = {
        "total_emails_found": total_emails_found,
        "processed_emails": processed_count,
        "skipped_emails": skipped_count,
        "pdfs_downloaded": pdfs_downloaded,
        "pdfs_parsed": pdfs_parsed,
        "pdfs_skipped": pdfs_skipped,
        "total_transactions": transaction_count,
        "skipped_details_sample": skipped_details[:50],
    }

    print("Sync summary:", summary)
    return summary


@router.post("/gmail/clear-processed-range")
async def clear_processed_range(request: Request):
    token = request.session.get("token")
    if not token:
        return {"error": "Not authenticated"}

    # require logged-in user for safety
    user = request.session.get("user")
    if not user:
        return {"error": "Must be logged in to clear processed flags"}

    service = get_gmail_service(token)

    # same query as processing (May 2025 through July 2026)
    query = "from:estatements@ndbbank.com after:2025/05/01 before:2026/08/01"
    all_message_ids = []
    next_token = None
    while True:
        params = {"userId": "me", "q": query}
        if next_token:
            params["pageToken"] = next_token
        results = service.users().messages().list(**params).execute()
        msgs = results.get("messages", [])
        all_message_ids.extend([m["id"] for m in msgs])
        next_token = results.get("nextPageToken")
        if not next_token:
            break

    if not all_message_ids:
        return {"deleted": 0, "messages_scoped": 0}

    db = SessionLocal()
    deleted = db.query(ProcessedEmail).filter(ProcessedEmail.message_id.in_(all_message_ids)).delete(synchronize_session=False)
    db.commit()
    db.close()

    return {"deleted": deleted, "messages_scoped": len(all_message_ids)}