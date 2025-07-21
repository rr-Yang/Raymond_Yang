import java.util.*;

/** Console‑only Gomoku (五子棋) – 人类执黑先手，电脑执白随机 */
public class GomokuConsole {

    // ====================== 基本数据结构 ======================
    enum Cell { EMPTY, BLACK, WHITE }

    /** 棋盘 */
    static class Board {
        private final int size;
        private final Cell[][] g;
        Board(int n) { size = n; g = new Cell[n][n]; clear(); }
        void clear() { for (Cell[] row : g) Arrays.fill(row, Cell.EMPTY); }
        boolean place(int r, int c, Cell p) {         // true = 成功
            if (p != Cell.EMPTY && g[r][c] != Cell.EMPTY) return false;  // 只有“落子”时才检测占位
            g[r][c] = p;
            return true;
        }
        boolean isEmpty(int r, int c) { return g[r][c] == Cell.EMPTY; }
        int getSize() { return size; }
        Cell get(int r,int c){ return g[r][c]; }
        boolean isFull(){ for(Cell[] row:g) for(Cell c:row) if(c==Cell.EMPTY) return false; return true; }
        void draw() {
            System.out.print("   ");                 // 列标头
            for (int c = 0; c < size; c++) System.out.printf("%2d ", c);
            System.out.println();
            for (int r = 0; r < size; r++) {
                System.out.printf("%2d ", r);        // 行编号
                for (int c = 0; c < size; c++) {
                    switch (g[r][c]) {
                        case BLACK -> System.out.print(" ● ");
                        case WHITE -> System.out.print(" ○ ");
                        default     -> System.out.print(" · ");
                    }
                }
                System.out.println();
            }
        }
    }

    /** 判断是否连成 5 子 */
    static class WinChecker {
        private static final int[][] DIR = { {0,1}, {1,0}, {1,1}, {1,-1} };
        static boolean isWin(Board b,int r,int c,Cell p){
            int n=b.getSize();
            for(int[] d:DIR){
                int cnt=1+count(b,r,c,d[0],d[1],p)+count(b,r,c,-d[0],-d[1],p);
                if(cnt>=5) return true;
            }
            return false;
        }
        private static int count(Board b,int r,int c,int dr,int dc,Cell p){
            int n=b.getSize(),k=0; r+=dr;c+=dc;
            while(r>=0&&r<n&&c>=0&&c<n&&b.get(r,c)==p){k++; r+=dr;c+=dc;}
            return k;
        }
    }

    // ====================== AI Model ======================
    

static class RuleAI {
    private final Random rng = new Random();
    private static final int WIN      = 100_000;
    private static final int BLOCK5   = 90_000;
    private static final int LIVE4    = 10_000;   // 活四
    private static final int BLOCK4   = 9_000;    // 冲四 / 对手活四
    private static final int LIVE3    = 1_000;    // 活三
    private static final int BLOCK3   = 900;      // 对手活三
    private static final int LIVE2    = 100;      // 活二
    // —— 其它棋形可继续补充 ——

    /** 返回 {row, col} */
    public int[] nextMove(Board b, Cell my, Cell opp) {
        int n = b.getSize();
        int bestScore = Integer.MIN_VALUE;
        List<int[]> bestMoves = new ArrayList<>();

        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                if (!b.isEmpty(r, c)) continue;

                // 1) 自己试下
                b.place(r, c, my);
                int score = evaluate(b, r, c, my);
                b.place(r, c, Cell.EMPTY);   // 撤回

                // 2) 看能否挡对手
                b.place(r, c, opp);
                int oppScore = evaluate(b, r, c, opp);
                b.place(r, c, Cell.EMPTY);

                if (oppScore >= WIN) score = BLOCK5;          // 挡对手必胜
                else if (oppScore >= LIVE4) score = Math.max(score, BLOCK4);

                // 收集同分点
                if (score > bestScore) {
                    bestScore = score;
                    bestMoves.clear();
                    bestMoves.add(new int[]{r, c});
                } else if (score == bestScore) {
                    bestMoves.add(new int[]{r, c});
                }
            }
        }
        // 随机挑选同分点，增加多样性
        return bestMoves.get(rng.nextInt(bestMoves.size()));
    }

    /** 仅概念演示：返回当前位置能形成的最高棋形分数 */
    private int evaluate(Board b, int r, int c, Cell p) {
        // A) 5 连
        if (WinChecker.isWin(b, r, c, p)) return WIN;

        // B) 简化扫描四方向，统计最大连子 & 两端空位
        int live4 = 0, block4 = 0, live3 = 0, block3 = 0, live2 = 0;
        int[][] DIR = { {0,1}, {1,0}, {1,1}, {1,-1} };

        for (int[] d : DIR) {
            int cnt = 1;                // 自己这颗算 1
            int openEnds = 0;           // 两端空格数量

            // 正方向
            int k = 1;
            while (inBoard(b, r + d[0]*k, c + d[1]*k) &&
                   b.get(r + d[0]*k, c + d[1]*k) == p) { cnt++; k++; }
            if (inBoard(b, r + d[0]*k, c + d[1]*k) &&
                b.get(r + d[0]*k, c + d[1]*k) == Cell.EMPTY) openEnds++;

            // 反方向
            k = 1;
            while (inBoard(b, r - d[0]*k, c - d[1]*k) &&
                   b.get(r - d[0]*k, c - d[1]*k) == p) { cnt++; k++; }
            if (inBoard(b, r - d[0]*k, c - d[1]*k) &&
                b.get(r - d[0]*k, c - d[1]*k) == Cell.EMPTY) openEnds++;

            // 根据 cnt / openEnds 分类
            if (cnt == 4 && openEnds == 2) live4++;
            else if (cnt == 4 && openEnds == 1) block4++;
            else if (cnt == 3 && openEnds == 2) live3++;
            else if (cnt == 3 && openEnds == 1) block3++;
            else if (cnt == 2 && openEnds == 2) live2++;
        }

        if (live4 > 0)   return LIVE4;
        if (block4 > 0)  return BLOCK4;
        if (live3 > 0)   return LIVE3;
        if (block3 > 0)  return BLOCK3;
        if (live2 > 0)   return LIVE2;
        return 1;  // 最低分
    }

    private boolean inBoard(Board b, int r, int c) {
        return r >= 0 && r < b.getSize() && c >= 0 && c < b.getSize();
    }
}

    

    // ====================== 主循环 ======================
    public static void main(String[] args) {
        final int SIZE = 15;
        Board board = new Board(SIZE);
        RuleAI ai = new RuleAI();
        Cell current = Cell.BLACK;               // 黑子先手
        Scanner in   = new Scanner(System.in);

        while (true) {
            board.draw();
            if (current == Cell.BLACK) {         // 人类回合
                System.out.print("你的回合 (格式: 行 列)：");
                int r = in.nextInt(), c = in.nextInt();
                if (!board.place(r, c, Cell.BLACK)) {
                    System.out.println("该位置不可用，请重新输入！");
                    continue;
                }
                if (WinChecker.isWin(board, r, c, Cell.BLACK)) {
                    board.draw(); System.out.println("🎉 你赢了！");
                    break;
                }
            } else {                             // 电脑回合
                int[] mv = ai.nextMove(board, Cell.WHITE, Cell.BLACK); // 白 = AI, 黑 = 你
                board.place(mv[0], mv[1], Cell.WHITE);
                System.out.printf("电脑落子: %d %d%n", mv[0], mv[1]);
                if (WinChecker.isWin(board, mv[0], mv[1], Cell.WHITE)) {
                    board.draw(); System.out.println("💻 电脑赢了！");
                    break;
                }
            }

            if (board.isFull()) { board.draw(); System.out.println("平局！"); break; }
            current = (current == Cell.BLACK ? Cell.WHITE : Cell.BLACK);
        }
    }
}

