# 🚗 Used Car Price Analysis

An exploratory data analysis (EDA) project that investigates the factors influencing used car prices — including engine size, drive wheels, body style, fuel type, and more.

---

## 📌 Overview

This project uses a real-world automotive dataset to uncover patterns in used car pricing. The analysis covers:

- **Data cleaning** — handling missing values, type conversion, and removing invalid records
- **Feature engineering** — converting MPG to L/100km, normalizing dimensions, and binning prices into Low / Medium / High categories
- **Exploratory analysis** — box plots, scatter plots, grouped aggregations, and pivot heatmaps
- **Statistical testing** — one-way ANOVA to compare price distributions across car makes
- **Regression visualization** — regression plots to highlight correlations (e.g., engine size vs. price)

### Key Findings

- **Engine size** shows a strong positive correlation with price — larger engines command higher prices.
- **Drive wheels** and **body style** jointly influence pricing. Rear-wheel drive (RWD) sedans and coupes rank among the most expensive combinations, while front-wheel drive (FWD) hatchbacks and wagons sit at the lower end.
- **ANOVA testing** confirms statistically significant price differences between certain makes (e.g., Honda vs. Subaru).

---

## 📂 Project Structure

```
├── Used-car-pirce-analysis.ipynb   # Main analysis notebook
├── data.csv                        # Raw dataset
└── README.md
```

---

## 📊 Dataset

**Source:** [UCI Machine Learning Repository — Automobile Dataset](https://archive.ics.uci.edu/dataset/10/automobile)

**Origin:** The dataset was compiled from the 1985 *Ward's Automotive Yearbook* and originally used in a study on decision-making in the insurance industry.

| Attribute        | Details                              |
|------------------|--------------------------------------|
| Rows             | 205 vehicles                         |
| Columns          | 26 features                          |
| Target variable  | `price` (USD)                        |
| Format           | CSV (no header row in raw file)      |

### Feature Summary

| Category         | Columns |
|------------------|---------|
| Risk & losses    | `symboling`, `normalized-losses` |
| Identity         | `make` |
| Engine           | `engine-type`, `engine-size`, `engine-location`, `fuel-type`, `fuel-system`, `aspiration`, `num-of-cylinders`, `bore`, `stroke`, `compression-ratio`, `horsepower`, `peak-rpm` |
| Body & chassis   | `body-style`, `num-of-doors`, `drive-wheels`, `wheel-base`, `length`, `width`, `height`, `curb-weight` |
| Efficiency       | `city-mpg`, `highway-mpg` |
| Target           | `price` |

> **Note:** Missing values in the raw file are encoded as `?` and are handled during preprocessing.

---

## 🛠️ Requirements

```
pandas
numpy
matplotlib
seaborn
scipy
```

Install with:

```bash
pip install pandas numpy matplotlib seaborn scipy
```

---

## 🚀 Usage

1. Clone the repository and ensure `data.csv` is in the same directory as the notebook.
2. Open `Used-car-pirce-analysis.ipynb` in Jupyter Notebook or JupyterLab.
3. Run all cells from top to bottom.

---

## 📄 License

The UCI Automobile dataset is publicly available for research and educational use. See the [UCI ML Repository](https://archive.ics.uci.edu/dataset/10/automobile) for full terms.
