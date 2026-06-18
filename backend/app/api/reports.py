from fastapi import APIRouter
from app.services.report_service import yearly_turnover,get_monthly_report,get_dashboard_summary,get_monthly_trend,get_recent_transactions

router=APIRouter()

@router.get("/reports/yearly/{year}")
def get_yearly_report(year:int):
    return yearly_turnover(year)

@router.get("/reports/monthly/{year}/{month}")
def monthly_report(year:int,month:int):
    return get_monthly_report(year,month)

@router.get("/dashboard/summary")
def dashboard_summary():
    return get_dashboard_summary()

@router.get("/dashboard/monthly-trend")
def monthly_trend():
    return get_monthly_trend()

@router.get("/dashboard/recent-transactions")
def recent_transactions():
    return get_recent_transactions()