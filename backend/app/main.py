from fastapi import FastAPI
from app.api.reports import router as reports_router

app=FastAPI()
app.include_router(reports_router)