from pathlib import Path

import joblib

_MODEL = None


def _project_root() -> Path:
    return Path(__file__).resolve().parents[2]


def _load_model():
    global _MODEL
    if _MODEL is not None:
        return _MODEL

    model_path = _project_root() / "ml" / "model.joblib"
    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")

    _MODEL = joblib.load(model_path)
    return _MODEL


def predict_status(jumlah_penjualan: float, harga: float, diskon: float) -> dict[str, float | str | None]:
    model = _load_model()
    features = [[jumlah_penjualan, harga, diskon]]

    prediction = model.predict(features)[0]
    status_prediksi = "Laris" if int(prediction) == 1 else "Tidak"

    probability = None
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(features)[0]
        probability = float(proba[1])

    return {"status_prediksi": status_prediksi, "probability": probability}
