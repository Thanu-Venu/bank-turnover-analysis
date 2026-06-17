from fastapi import APIRouter
from starlette.requests import Request
import os
from app.core.oauth import oauth

router=APIRouter()

@router.get("/auth/login")
async def login(request:Request):
    redirect_uri=os.getenv("GOOGLE_REDIRECT_URI")

    return await oauth.google.authorize_redirect(
        request,
        redirect_uri
    )

@router.get("/auth/callback")
async def auth_callback(request:Request):
    token = await oauth.google.authorize_access_token(
        request
    )
    print("login succesful")
    user_info= token.get("userinfo")

    return{

        "email":user_info["email"],
        "name":user_info["name"],
    }