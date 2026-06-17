from fastapi import APIRouter
from starlette.requests import Request
from app.services.gmail_service import get_gmail_service,get_message_details
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