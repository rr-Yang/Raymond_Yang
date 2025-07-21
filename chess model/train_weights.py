# train_weights.py
# pip install scikit-learn numpy joblib
import json, joblib, numpy as np
from sklearn.linear_model import SGDRegressor            # 线性
# ----------------------------------------------------------
# ❶ 组织训练数据 X, y
# X.shape = (samples, 6)  (five, live4, block4, live3, block3, live2)
# y.shape = (samples,)    (+1 赢, -1 输)   —— 示例随机数据
np.random.seed(0)
X = np.random.randint(0, 3, size=(2000, 6))
y = np.random.choice([-1, 1], size=(2000,))

# ❷ 训练
model = SGDRegressor(max_iter=1000, tol=1e-3).fit(X, y)

# ❸ 导出权重
weights = model.coef_.tolist()          # 6 个
bias    = float(model.intercept_[0])
with open("gomoku_weights.json", "w") as f:
    json.dump({"w": weights, "b": bias}, f, indent=2)
print("Saved gomoku_weights.json")
