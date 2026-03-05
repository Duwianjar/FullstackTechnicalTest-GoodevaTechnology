from typing import Optional

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class SalesRecord(BaseModel):
    product_id: str
    product_name: str
    jumlah_penjualan: int
    harga: float
    diskon: float
    status: str


class PredictRequest(BaseModel):
    jumlah_penjualan: float
    harga: float
    diskon: float


class PredictResponse(BaseModel):
    status_prediksi: str
    probability: Optional[float] = None
