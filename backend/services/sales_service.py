import csv
from pathlib import Path
from typing import Any


def _project_root() -> Path:
    return Path(__file__).resolve().parents[2]


def load_sales_data() -> list[dict[str, Any]]:
    csv_path = _project_root() / "data" / "sales_data.csv"
    if not csv_path.exists():
        raise FileNotFoundError(f"CSV not found: {csv_path}")

    records: list[dict[str, Any]] = []
    with csv_path.open(mode="r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            records.append(
                {
                    "product_id": row["product_id"],
                    "product_name": row["product_name"],
                    "jumlah_penjualan": int(row["jumlah_penjualan"]),
                    "harga": float(row["harga"]),
                    "diskon": float(row["diskon"]),
                    "status": row["status"],
                }
            )

    return records
