from fastapi import APIRouter
from starlette.requests import Request
from app.services.report_service import (
    yearly_turnover,
    get_monthly_report,
    get_dashboard_summary,
    get_monthly_trend,
    get_recent_transactions,
)

router=APIRouter()


def _owner_from_request(request: Request):
    user = request.session.get("user")
    return user.get("email") if user else None


@router.get("/reports/yearly/{year}")
def get_yearly_report(request: Request, year:int):
    owner = _owner_from_request(request)
    return yearly_turnover(year, owner_email=owner)


@router.get("/reports/monthly/{year}/{month}")
def monthly_report(request: Request, year:int,month:int):
    owner = _owner_from_request(request)
    return get_monthly_report(year,month, owner_email=owner)


@router.get("/dashboard/summary")
def dashboard_summary(request: Request):
    owner = _owner_from_request(request)
    return get_dashboard_summary(owner_email=owner)


@router.get("/dashboard/monthly-trend")
def monthly_trend(request: Request):
    owner = _owner_from_request(request)
    return get_monthly_trend(owner_email=owner)


@router.get("/dashboard/recent-transactions")
def recent_transactions(request: Request):
    owner = _owner_from_request(request)
    return get_recent_transactions(owner_email=owner)