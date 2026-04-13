# 👨‍💻 Raymond Yang Coding Repository

A collection of data science, machine learning, and web development projects.

## Summary
Data Science professional with 4 years hands-on experience spanning financial BI, data engineering, and predictive analytics. Proven ability to design end-to-end data solutions — from building Snowflake data marts and Databricks pipelines to delivering Power BI dashboards and executive-ready insights — across industries including biomedical research and logistics. Skilled in Python, SQL, and ML frameworks (Scikit-learn, XGBoost, TensorFlow) with a track record of automating workflows, cutting operational costs, and translating complex data into actionable recommendations for non-technical stakeholders. Equally comfortable working cross-functionally with scientists, product teams, and leadership as architecting backend pipelines and running A/B and predictive analyses.

---

## Projects

### 🏠 House Price Prediction
> Machine Learning · Python · scikit-learn

Predicts residential property sale prices from structured housing data. Includes full EDA, correlation heatmaps, categorical feature analysis, One-Hot Encoding, and a comparison of two regression models.

| | |
|---|---|
| **Dataset** | Kaggle — House Prices Advanced Regression (2,919 rows, 13 features) |
| **Models** | Support Vector Regression (SVR), Random Forest Regression |
| **Metric** | Mean Absolute Percentage Error (MAPE) |
| **Stack** | Python, pandas, scikit-learn, seaborn, matplotlib |

📁 [`Python Library Projects/`](./Python%20Library%20Projects)

---

### 🚗 Used Car Price Analysis
> Data Analysis · Python · EDA

Exploratory analysis of the UCI Automobile dataset investigating factors that drive used car pricing — engine size, drive wheels, body style, and more.

| | |
|---|---|
| **Dataset** | UCI ML Repository — Automobile (205 vehicles, 26 features) |
| **Analysis** | Correlation heatmap, box plots, scatter plots, ANOVA, price binning |
| **Key Finding** | Engine size and drive-wheel type are the strongest price predictors |
| **Stack** | Python, pandas, numpy, seaborn, matplotlib, scipy |

📁 [`Python Library Projects/`](./Python%20Library%20Projects)

---

### ♟️ Gomoku AI (五子棋)
> Artificial Intelligence · Java · Python

Gomoku (Five-in-a-Row) game with a rule-based heuristic AI. Available in both a Swing GUI and console mode. Includes a Python script to train and export evaluation weights via linear regression.

| | |
|---|---|
| **AI Strategy** | Pattern scoring: Live 4 › Block 4 › Live 3 › … with random tie-breaking |
| **GUI** | Java Swing — wooden-style 15×15 board, click-to-play |
| **ML Component** | SGDRegressor trained on 6 board pattern features → `gomoku_weights.json` |
| **Stack** | Java (Swing), Python, scikit-learn |

📁 [`chess model/`](./chess%20model)

---

### 🎵 Music Streaming Web App
> Web Development · HTML · CSS · JavaScript

A front-end music streaming application powered by the iTunes Search API. No back-end or API key required.

| | |
|---|---|
| **Pages** | Home (playlist generator), Playlist (Top 200 / Discovery / Mix), Search, Upload |
| **Features** | 30-sec previews, genre + city filtering, local file upload, localStorage persistence |
| **API** | iTunes Search API & RSS Feed (no key required) |
| **Stack** | HTML5, CSS3, Vanilla JavaScript (ES2020+) |

📁 [`music streaming/`](./music%20streaming) · 🌐 [Live Demo](https://rr-yang.github.io/Raymond_Yang/music%20streaming/index.html)

---

## Repo Structure

```
Raymond_Yang/
├── Python Library Projects/     # House price prediction & used car analysis
├── chess model/                 # Gomoku AI (Java + Python)
├── music streaming/             # Music web app (HTML/CSS/JS)
├── index.html                   # Portfolio homepage
├── contact.html                 # Contact page
├── script.js                    # Portfolio scripts
└── styles.css                   # Portfolio styles
```

---

## Tech Stack Overview

| Area | Technologies |
|------|-------------|
| Data Science | Python, pandas, numpy, scikit-learn, scipy |
| Visualization | matplotlib, seaborn |
| AI / ML | scikit-learn (SVR, Random Forest, SGDRegressor) |
| Web | HTML5, CSS3, JavaScript (ES2020+) |
| Desktop | Java, Swing |
| Hosting | GitHub Pages |
