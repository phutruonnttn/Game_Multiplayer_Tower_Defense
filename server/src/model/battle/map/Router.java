package model.battle.map;

import config.battle.MapConfig;

import java.util.PriorityQueue;

public class Router {


    static final int[] DIRECTION = {0, 1, 2, 3};
    static final double COST_ZIGZAG = 0.01;
    static final double COST = 10;
    static final double oo = 1000000;
    static int numberVert = MapConfig.widthMap * MapConfig.heightMap;
    static int widthMap = MapConfig.widthMap;
    static int heightMap = MapConfig.heightMap;
    static int[][] vertArr = new int[heightMap][widthMap];
    static Point[] pointArr = new Point[numberVert];

    static {
        for (int i = 0; i < heightMap; i++){
            for(int j = 0; j < widthMap; j++){
                vertArr[i][j] = i * widthMap + j;
                pointArr[i * widthMap + j] = new Point(i, j);
            }
        }
    }

    private int[] routeTable = new int[numberVert];
    private boolean[] status = new boolean[numberVert];
    private int[] directionArr = new int[numberVert];
    private double[] costArr = new double[numberVert];

    public void route(int[][] map){
        for(int i = 0; i < numberVert; i++){
            routeTable[i] = -1;
            directionArr[i] = -1;
            costArr[i] = oo;
            status[i] = false;
        }
        costArr[numberVert - 1] = 0;
        directionArr[numberVert - 1] = DIRECTION[2];

        PriorityQueue<HeapNode> pq = new PriorityQueue<>();
        pq.add(new HeapNode(pointToVert(MapConfig.goal), 0));

        while (!pq.isEmpty()){
            HeapNode node = pq.poll();
            int vert = node.vert;
            double val = node.val;
            if(status[node.vert]){
                continue;
            }
            status[vert] = true;
            int[] listNeighbor = getNeighbor(map, vertToPoint(vert));
            for(int i = 0; i < listNeighbor.length; i++){
                int targetVert = listNeighbor[i];
                if(targetVert != -1){
                    double cost = getCost(directionArr[vert], DIRECTION[i]);
                    if (val +  cost <  costArr[targetVert]){
                        costArr[targetVert] = val + cost;
                        directionArr[targetVert] = DIRECTION[i];
                        routeTable[targetVert] = vert;
                        pq.add(new HeapNode(targetVert, costArr[targetVert]));
                    }
                }
            }
        }


    }

    private int[] getNeighbor(int[][] map, Point p){
        int[] neighborList = new int[4];
        int x = p.x;
        int y = p.y;
        int k = 0;
        for (int i = 0; i < 4; i++){
            neighborList[i] = -1;
        }
        if(x + 1 < heightMap && map[x+1][y] == 0){
            neighborList[k] = vertArr[x+1][y];
        }
        k++;
        if (y + 1 < widthMap && map[x][y+1] == 0){
            neighborList[k] = vertArr[x][y+1];
        }
        k++;
        if(x - 1 >= 0 && map[x-1][y] == 0){
            neighborList[k] = vertArr[x-1][y];
        }
        k++;
        if (y - 1 >= 0 && map[x][y-1] == 0){
            neighborList[k] = vertArr[x][y-1];
        }
        return neighborList;//r,b,l,t
    }

    private static double getCost(int curDirection, int targetDirection) {
        double cost = COST;
        if(curDirection != targetDirection){
            cost += COST_ZIGZAG;
        }
        return cost;
    }

    private static int pointToVert(Point point){
        return vertArr[point.x][point.y];
    }

    private static Point vertToPoint(int vert){
        return pointArr[vert];
    }

    @Override
    public String toString(){
        String s = "";
        for (int i = 0 ; i < this.routeTable.length; i++){
            s += this.routeTable[i] + " ";
        }
        return s;
    }
}

class HeapNode implements Comparable<HeapNode>{
    int vert;
    double val;

    public HeapNode(int vert, double val){
        this.val = val;
        this.vert = vert;
    }

    @Override
    public int compareTo(HeapNode o) {
        if(val > o.val){
            return 1;
        }
        if (val < o.val){
            return -1;
        }
        return 0;
    }
}


