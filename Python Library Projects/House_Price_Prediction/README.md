# 🏠 House Price Prediction

A machine learning project that predicts residential property sale prices using structured housing data. The pipeline covers exploratory data analysis, data cleaning, feature encoding, and model training with two regression algorithms.

---

## Dataset

**File:** `HousePricePrediction.xlsx`  
**Source:** [Kaggle — House Prices: Advanced Regression Techniques](https://www.kaggle.com/competitions/house-prices-advanced-regression-techniques)

| Attribute | Details |
|-----------|---------|
| Rows | 2,919 |
| Columns | 13 |
| Target variable | `SalePrice` (USD) |
| Price range | $34,900 — $755,000 |
| Mean sale price | ~$180,921 |

### Features

| Column | Type | Description |
|--------|------|-------------|
| `MSSubClass` | Integer | Building class |
| `MSZoning` | Categorical | Municipal zoning (RL, RM, FV, etc.) |
| `LotArea` | Integer | Lot size in square feet |
| `LotConfig` | Categorical | Lot configuration (Inside, Corner, CulDSac…) |
| `BldgType` | Categorical | Dwelling type (1Fam, Duplex, Twnhs…) |
| `OverallCond` | Integer | Overall condition rating (1–10) |
| `YearBuilt` | Integer | Original construction year |
| `YearRemodAdd` | Integer | Remodel year (same as build year if no remodel) |
| `Exterior1st` | Categorical | Primary exterior material (VinylSd, BrkFace…) |
| `BsmtFinSF2` | Integer | Type 2 finished basement area (sq ft) |
| `TotalBsmtSF` | Integer | Total basement area (sq ft) |
| `SalePrice` | Integer | **Target** — property sale price (USD) |

---

## Project Workflow

**1. Exploratory Data Analysis**
- Identify column data types: categorical (object), integer, and float
- Correlation heatmap (BrBG colormap) across all numerical features
- Bar chart of unique value counts per categorical feature
- Distribution plots for each categorical column

**2. Categorical Feature Reference**
The notebook includes a breakdown of every category label:
- `MSZoning`: RL, RM, RH, FV, C(all)
- `LotConfig`: Inside, Corner, CulDSac, FR2, FR3
- `BldgType`: 1Fam, TwnhsE, Twnhs, Duplex, 2fmCon
- `Exterior1st`: VinylSd, MetalSd, HdBoard, BrkFace, Stucco, and more

**3. Data Cleaning**
- Drop the `Id` column (non-informative index)
- Fill missing `SalePrice` values with the column mean
- Drop remaining rows with any missing values

**4. Feature Encoding**
- One-Hot Encode all categorical columns using `sklearn.preprocessing.OneHotEncoder`
- Merge encoded columns back into the cleaned dataframe

**5. Model Training**
80/20 train-validation split (`random_state=0`), then two models are trained and evaluated:

| Model | Library | Metric |
|-------|---------|--------|
| Support Vector Regression (SVR) | `sklearn.svm.SVR` | MAPE |
| Random Forest Regression | `sklearn.ensemble.RandomForestRegressor` (10 trees) | MAPE |

---

## Requirements

```
pandas
matplotlib
seaborn
scikit-learn
openpyxl
```

Install with:

```bash
pip install pandas matplotlib seaborn scikit-learn openpyxl
```

---

## Usage

1. Place `HousePricePrediction.xlsx` in the same directory as the notebook.
2. Open `House-Price-Prediction.ipynb` in Jupyter Notebook or JupyterLab.
3. Run all cells top to bottom.
