from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from app.api.auth import router as auth_router
from app.api.reports import router as reports_router
import os
from dotenv import load_dotenv

app=FastAPI()
load_dotenv()
print("SECRET_KEY =", os.getenv("SECRET_KEY"))
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY")
)
app.include_router(auth_router)
app.include_router(reports_router)

@app.get("/")
def root():
    return {"message":"Welcome to the Bank Turnover Analysis API"}