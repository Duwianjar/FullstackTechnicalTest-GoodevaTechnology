from fastapi import APIRouter, Depends, HTTPException, status

from backend.core.security import get_current_user
from backend.schemas import SalesRecord
from backend.services.sales_service import load_sales_data

router = APIRouter(tags=["sales"])


@router.get("/sales", response_model=list[SalesRecord])
def get_sales(_: dict = Depends(get_current_user)) -> list[SalesRecord]:
    try:
        rows = load_sales_data()
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc
    return [SalesRecord(**row) for row in rows]
