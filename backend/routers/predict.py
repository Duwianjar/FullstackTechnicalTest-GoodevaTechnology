from fastapi import APIRouter, Depends, HTTPException, status

from backend.core.security import get_current_user
from backend.schemas import PredictRequest, PredictResponse
from backend.services.ml_service import predict_status

router = APIRouter(tags=["predict"])


@router.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest, _: dict = Depends(get_current_user)) -> PredictResponse:
    try:
        result = predict_status(
            jumlah_penjualan=payload.jumlah_penjualan,
            harga=payload.harga,
            diskon=payload.diskon,
        )
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

    return PredictResponse(**result)
