from fastapi import APIRouter
from starlette.requests import Request
from app.services.gmail_service import get_gmail_service,get_message_details,get_message,download_attachment
from app.services.statement_processor import process_statement

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