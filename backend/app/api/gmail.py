from fastapi import APIRouter
from starlette.requests import Request
from app.services.gmail_service import get_gmail_service,get_message_details,get_message,download_attachment
from app.services.statement_processor import process_statement
from app.services.transaction_storage import save_transactions
from app.services.email_tracker import(is_email_processed,mark_email_processed)
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

    messages=results.get("messages",[])

    processed_count=0
    skipped_count=0
    transaction_count=0

    for msg in messages:
        message_id=msg["id"]

        if is_email_processed(message_id):
            skipped_count+=1
            continue

        message=get_message(
            service,
            message_id
        )

        parts=message["payload"].get("parts",[])
        for part in parts:
            filename=part.get("filename")

            if not filename.endswith(".pdf"):
                continue
            attachment_id=part["body"]["attachmentId"]
            pdf_data=download_attachment(
                service,
                message_id,
                attachment_id
            )
            pdf_path=f"statements/{filename}"
            with open(pdf_path,"wb") as f:
                f.write(pdf_data)
            transactions=process_statement(pdf_path)
            save_transactions(transactions)
            transaction_count+=len(transactions)
            mark_email_processed(message_id)
            processed_count+=1

    return{
        "processed_emails":processed_count,
        "skipped_emails":skipped_count,
        "total_transactions":transaction_count
    }