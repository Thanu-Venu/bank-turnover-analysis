from fastapi import FastAPI
from dotenv import load_dotenv
load_dotenv()
from starlette.middleware.sessions import SessionMiddleware
from app.api.auth import router as auth_router
from app.api.reports import router as reports_router
import os
from app.api.gmail import router as gmail_router
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

print("SECRET_KEY =", os.getenv("SECRET_KEY"))
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY")
)
app.include_router(auth_router)
app.include_router(reports_router)
app.include_router(gmail_router)

@app.get("/")
def root():
    return {"message":"Welcome to the Bank Turnover Analysis API"}