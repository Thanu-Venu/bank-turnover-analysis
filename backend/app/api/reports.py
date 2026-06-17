from fastapi import APIRouter
from app.services.report_service import yearly_turnover

router=APIRouter()

@router.get("/reports/yearly/{year}")
def get_yearly_report(year:int):
    return yearly_turnover(year)