from fastapi import APIRouter
from app.services.report_service import yearly_turnover,get_monthly_report

router=APIRouter()

@router.get("/reports/yearly/{year}")
def get_yearly_report(year:int):
    return yearly_turnover(year)

@router.get("/reports/monthly/{year}/{month}")
def monthly_report(year:int,month:int):
    return get_monthly_report(year,month)