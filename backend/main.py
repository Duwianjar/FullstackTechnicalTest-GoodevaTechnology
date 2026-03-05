from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers.auth import router as auth_router
from backend.routers.predict import router as predict_router
from backend.routers.sales import router as sales_router

app = FastAPI(
    title="Sales Prediction API",
    version="1.0.0",
    description="FastAPI backend for auth, sales data, and ML prediction.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(sales_router)
app.include_router(predict_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "API is running. Open /docs for Swagger UI."}
