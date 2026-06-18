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
        redirect_uri,
        access_type="offline",
        prompt="consent"
    )

@router.get("/auth/callback")
async def auth_callback(request:Request):
    token = await oauth.google.authorize_access_token(
        request
    )
    print(token.keys())

    request.session["token"]=token
    print("login succesful")
    user_info= token.get("userinfo")
    request.session["user"] = {
    "name": user_info["name"],
    "email": user_info["email"]
    }

    return{

        "email":user_info["email"],
        "name":user_info["name"],
    }

@router.get("/auth/me")
async def get_user(request: Request):

    user=request.session.get("user")

    if not user :
        return{
            "error":"Not authenticated"
        }
    return user