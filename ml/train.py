from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split


def main() -> None:
    project_root = Path(__file__).resolve().parents[1]
    data_path = project_root / "data" / "sales_data.csv"
    model_path = project_root / "ml" / "model.joblib"

    if not data_path.exists():
        raise FileNotFoundError(f"Dataset tidak ditemukan: {data_path}")

    df = pd.read_csv(data_path)

    required_columns = ["jumlah_penjualan", "harga", "diskon", "status"]
    missing = [column for column in required_columns if column not in df.columns]
    if missing:
        raise ValueError(f"Kolom wajib tidak ditemukan: {missing}")

    X = df[["jumlah_penjualan", "harga", "diskon"]]
    y = df["status"].map({"Laris": 1, "Tidak": 0})
    if y.isna().any():
        bad_values = sorted(df.loc[y.isna(), "status"].dropna().unique().tolist())
        raise ValueError(f"Nilai status tidak valid: {bad_values}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    joblib.dump(model, model_path)

    print("Training selesai.")
    print(f"Data train: {len(X_train)} rows")
    print(f"Data test : {len(X_test)} rows")
    print(f"Accuracy  : {accuracy:.4f}")
    print(f"Model disimpan di: {model_path}")


if __name__ == "__main__":
    main()
