from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from dotenv import load_dotenv
import os
import base64

load_dotenv()

def get_gmail_service(token):

    credentials= Credentials(
        token=token["access_token"],
        refresh_token=token["refresh_token"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
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

def get_message(service,message_id):
    return(
        service.users()
        .messages()
        .get(
            userId="me",
            id=message_id
        )
        .execute()
    )

def download_attachment(
    service,
    message_id,
    attachment_id
):
    attachment=(
        service.users()
        .messages()
        .attachments()
        .get(
            userId="me",
            messageId=message_id,
            id=attachment_id
        )
        .execute()
    )

    data=attachment["data"]
    file_data=base64.urlsafe_b64decode(data)
    return file_data