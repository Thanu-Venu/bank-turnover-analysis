from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

def get_gmail_service(token):

    credentials= Credentials(
        token=token["access_token"]
    )

    service=build(
        "gmail",
        "v1",
        credentials=credentials
    )
    return service

def get_message_details(service,message_id):
    message = (
        service.users()
        .messages()
        .get(
            userId="me",
            id=message_id
        )
        .execute()
    )
    return message