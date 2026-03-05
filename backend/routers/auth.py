import os

from fastapi import APIRouter, HTTPException, status

from backend.core.security import create_access_token
from backend.schemas import LoginRequest, TokenResponse

router = APIRouter(tags=["auth"])

DUMMY_USERNAME = os.getenv("APP_USERNAME", "admin")
DUMMY_PASSWORD = os.getenv("APP_PASSWORD", "admin123")


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    if payload.username != DUMMY_USERNAME or payload.password != DUMMY_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    token = create_access_token(subject=payload.username)
    return TokenResponse(access_token=token)
