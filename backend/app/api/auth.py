from fastapi import APIRouter
from starlette.requests import Request
import os
from app.core.oauth import oauth
from fastapi.responses import RedirectResponse
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

    return RedirectResponse(url="http://localhost:5174/")


@router.get("/auth/me")
async def get_user(request: Request):

    user=request.session.get("user")

    if not user :
        return{
            "error":"Not authenticated"
        }
    return user

@router.get("/auth/logout")
async def logout(request: Request):
    request.session.clear()
    return{
        "message":"Logged out successfully"
    }