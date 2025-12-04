import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.*;

/**
 * Gomoku (五子棋) Swing 版本 – 人类执黑，电脑执白（规则评估 AI）
 * ✔ 基本棋盘/胜负判定
 * ✔ 人机循环（鼠标点击 + 电脑自动下）
 * ✔ 规则 AI：活四 › 冲四 › 活三 › … ，并能拦截对手五连
 *
 * 编译运行：
 *   javac GomokuGame.java
 *   java  GomokuGame
 */
public class GomokuGame extends JFrame {
    // === 可调常量 ===
    private static final int BOARD_SIZE = 15;  // 15×15
    private static final int CELL_PX    = 40;  // 单格像素
    private static final int PADDING    = 40;  // 边距
    private static final int STONE_R    = CELL_PX / 2 - 2;

    private final Board board = new Board(BOARD_SIZE);
    private final RuleAI ai   = new RuleAI();

    public GomokuGame() {
        setTitle("Gomoku – 玩家(黑) VS 电脑(白)");
        setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        setResizable(false);
        GamePanel panel = new GamePanel();
        panel.setPreferredSize(new Dimension(PADDING*2 + CELL_PX*BOARD_SIZE,
                                              PADDING*2 + CELL_PX*BOARD_SIZE));
        setContentPane(panel);
        pack();
        setLocationRelativeTo(null);
        setVisible(true);
    }

    /* =========================== GUI 面板 ============================ */
    private class GamePanel extends JPanel implements MouseListener {
        private Cell currentPlayer = Cell.BLACK;    // 玩家先手
        GamePanel() { addMouseListener(this); }

        @Override protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                                 RenderingHints.VALUE_ANTIALIAS_ON);
            // 背景
            g2.setColor(new Color(242,176,109));
            g2.fillRect(0,0,getWidth(),getHeight());
            // 网格
            g2.setColor(Color.DARK_GRAY);
            for(int i=0;i<BOARD_SIZE;i++){
                int x = PADDING + i*CELL_PX;
                int y0 = PADDING;
                int y1 = PADDING + (BOARD_SIZE-1)*CELL_PX;
                g2.drawLine(x,y0,x,y1);
                g2.drawLine(y0,x,y1,x);
            }
            // 棋子
            for(int r=0;r<BOARD_SIZE;r++){
                for(int c=0;c<BOARD_SIZE;c++){
                    Cell cell = board.get(r,c);
                    if(cell==Cell.EMPTY) continue;
                    int cx = PADDING + c*CELL_PX;
                    int cy = PADDING + r*CELL_PX;
                    g2.setColor(cell==Cell.BLACK?Color.BLACK:Color.WHITE);
                    g2.fillOval(cx-STONE_R, cy-STONE_R, STONE_R*2, STONE_R*2);
                    g2.setColor(Color.BLACK);
                    g2.drawOval(cx-STONE_R, cy-STONE_R, STONE_R*2, STONE_R*2);
                }
            }
        }

        /* ------------------- 鼠标点击 ------------------- */
        @Override public void mouseClicked(MouseEvent e) {
            if(currentPlayer!=Cell.BLACK) return; // 等电脑下完
            int col = Math.round((e.getX()-PADDING)/(float)CELL_PX);
            int row = Math.round((e.getY()-PADDING)/(float)CELL_PX);
            if(!board.inBounds(row,col) || !board.isEmpty(row,col)) return;
            makeMove(row,col,Cell.BLACK);
            repaint();
            if(checkEnd(row,col,Cell.BLACK)) return;
            // 电脑下
            int[] mv = ai.nextMove(board, Cell.WHITE, Cell.BLACK);
            makeMove(mv[0],mv[1],Cell.WHITE);
            repaint();
            checkEnd(mv[0],mv[1],Cell.WHITE);
        }
        private void makeMove(int r,int c, Cell who){
            board.place(r,c,who);
            currentPlayer = (who==Cell.BLACK?Cell.WHITE:Cell.BLACK);
        }
        private boolean checkEnd(int r,int c,Cell who){
            if(WinChecker.isWin(board,r,c,who)){
                JOptionPane.showMessageDialog(this,(who==Cell.BLACK?"你赢了!":"电脑赢了!"));
                reset();
                return true;
            }
            if(board.isFull()){
                JOptionPane.showMessageDialog(this,"平局!");
                reset();
                return true;
            }
            return false;
        }
        private void reset(){ board.clear(); currentPlayer=Cell.BLACK; repaint(); }
        // 无用接口
        public void mousePressed(MouseEvent e){}
        public void mouseReleased(MouseEvent e){}
        public void mouseEntered(MouseEvent e){}
        public void mouseExited(MouseEvent e){}
    }

    /* =========================== 数据结构 ============================ */
    enum Cell { EMPTY, BLACK, WHITE }

    static class Board {
        private final Cell[][] g;
        Board(int n){ g=new Cell[n][n]; clear(); }
        void clear(){ for(Cell[] row:g) Arrays.fill(row,Cell.EMPTY); }
        boolean inBounds(int r,int c){ return r>=0&&r<g.length&&c>=0&&c<g.length; }
        Cell get(int r,int c){ return g[r][c]; }
        boolean isEmpty(int r,int c){ return g[r][c]==Cell.EMPTY; }
        boolean place(int r,int c,Cell p){
            if(p!=Cell.EMPTY && g[r][c]!=Cell.EMPTY) return false; // 防止覆盖
            g[r][c]=p; return true;
        }
        boolean isFull(){ for(Cell[] row:g) for(Cell cell:row) if(cell==Cell.EMPTY) return false; return true; }
        int size(){ return g.length; }
    }

    static class WinChecker {
        private static final int[][] D={{0,1},{1,0},{1,1},{1,-1}};
        static boolean isWin(Board b,int r,int c,Cell p){
            for(int[] d:D){
                int cnt=1+count(b,r,c,d[0],d[1],p)+count(b,r,c,-d[0],-d[1],p);
                if(cnt>=5) return true;
            }
            return false;
        }
        private static int count(Board b,int r,int c,int dr,int dc,Cell p){
            int n=b.size(),k=0; r+=dr;c+=dc;
            while(r>=0&&r<n&&c>=0&&c<n&&b.get(r,c)==p){k++; r+=dr; c+=dc;}
            return k;
        }
    }

    /* =========================== 规则评估 AI ========================= */
    static class RuleAI {
        private final Random rng = new Random();
        private static final int WIN=100000, BLOCK5=90000, LIVE4=10000, BLOCK4=9000, LIVE3=1000, BLOCK3=900, LIVE2=100;
        private static final int[][] DIR={{0,1},{1,0},{1,1},{1,-1}};
        int[] nextMove(Board b, Cell my, Cell opp){
            int n = b.size();
            int best = -1;
            java.util.List<int[]> list = new java.util.ArrayList<>();
            for(int r=0;r<n;r++) for(int c=0;c<n;c++) if(b.isEmpty(r,c)){
                // 自己试下
                b.place(r,c,my);
                int score=eval(b,r,c,my);
                b.place(r,c,Cell.EMPTY);
                // 拦截对手
                b.place(r,c,opp);
                int os=eval(b,r,c,opp);
                b.place(r,c,Cell.EMPTY);
                if(os>=WIN) score=BLOCK5; else if(os>=LIVE4) score=Math.max(score,BLOCK4);
                // 更新最优
                if(score>best){best=score; list.clear(); list.add(new int[]{r,c});}
                else if(score==best){list.add(new int[]{r,c});}
            }
            return list.get(rng.nextInt(list.size()));
        }
        private int eval(Board b,int r,int c,Cell p){
            if(WinChecker.isWin(b,r,c,p)) return WIN;
            int live4=0,block4=0,live3=0,block3=0,live2=0;
            for(int[] d:DIR){
                int cnt=1,open=0; // 正方向
                int k=1; while(inB(b,r+k*d[0],c+k*d[1])&&b.get(r+k*d[0],c+k*d[1])==p){cnt++;k++;}
                if(inB(b,r+k*d[0],c+k*d[1])&&b.get(r+k*d[0],c+k*d[1])==Cell.EMPTY) open++;
                k=1; while(inB(b,r-k*d[0],c-k*d[1])&&b.get(r-k*d[0],c-k*d[1])==p){cnt++;k++;}
                if(inB(b,r-k*d[0],c-k*d[1])&&b.get(r-k*d[0],c-k*d[1])==Cell.EMPTY) open++;
                if(cnt==4 && open==2) live4++;
                else if(cnt==4 && open==1) block4++;
                else if(cnt==3 && open==2) live3++;
                else if(cnt==3 && open==1) block3++;
                else if(cnt==2 && open==2) live2++;
            }
            if(live4>0) return LIVE4;
            if(block4>0) return BLOCK4;
            if(live3>0) return LIVE3;
            if(block3>0) return BLOCK3;
            if(live2>0) return LIVE2;
            return 1;
        }
        private boolean inB(Board b,int r,int c){ return r>=0&&r<b.size()&&c>=0&&c<b.size(); }
    }

    /* =========================== main ============================ */
    public static void main(String[] args){ SwingUtilities.invokeLater(GomokuGame::new); }
}

