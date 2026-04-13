# ♟️ Gomoku AI (五子棋)

A Java implementation of Gomoku (Five-in-a-Row) with a rule-based AI opponent, available in both a graphical (Swing GUI) and console mode. Includes a Python script to train and export AI evaluation weights.

---

## Modes

### 🖥️ GUI Mode — `GomokuGame.java`
A Swing desktop app with a rendered wooden-style board. Click to place your stone; the AI responds instantly.

### 💻 Console Mode — `GomokuConsole.java`
Play entirely in the terminal. Enter moves as `row col` coordinates (0-indexed). Designed for quick testing or environments without a display.

---

## AI Design

The AI uses a **rule-based heuristic evaluator** — no minimax or deep search. On each turn it scores every empty cell by simulating a placement for itself and the opponent, then picks the highest-scoring move.

### Pattern Scoring Table

| Pattern | Score | Description |
|---------|------:|-------------|
| Five-in-a-row | 100,000 | Winning move |
| Block opponent's five | 90,000 | Must-block |
| Live four (both ends open) | 10,000 | Unstoppable threat |
| Block four / Rush four | 9,000 | Urgent defense |
| Live three | 1,000 | Strong attack |
| Block three | 900 | Defensive |
| Live two | 100 | Early position |

Ties in score are broken randomly to add variety.

---

## ML Weight Training — `train_weights.py`

A lightweight Python script that trains a linear regression model (`SGDRegressor`) on board pattern features and exports the learned weights to `gomoku_weights.json`.

### Features (6)
`five`, `live4`, `block4`, `live3`, `block3`, `live2`

### Output — `gomoku_weights.json`
```json
{
  "w": [w0, w1, w2, w3, w4, w5],
  "b": bias
}
```
These weights can be used to replace the hard-coded heuristic scores in the Java AI.

---

## Project Structure

```
chess model/
├── GomokuGame.java        # GUI version (Swing)
├── GomokuConsole.java     # Console version
├── train_weights.py       # Python weight training script
└── gomoku_weights.json    # Exported model weights
```

---

## Getting Started

### Java — GUI
```bash
javac GomokuGame.java
java  GomokuGame
```

### Java — Console
```bash
javac GomokuConsole.java
java  GomokuConsole
```

### Python — Train Weights
```bash
pip install scikit-learn numpy joblib
python train_weights.py
# outputs gomoku_weights.json
```

---

## Rules

- Board: 15 × 15
- Black (human) moves first
- First to place **5 stones in a row** (horizontal, vertical, or diagonal) wins
- Game ends in a draw if the board is full
