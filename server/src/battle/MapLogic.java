package battle;

import battle.model.CellLogic;
import config.battle.BattleConfig;
import dsa.PointOfPriorityQueue;
import dsa.PriorityQueue;
import dsa.Queue;
import model.battle.map.MapBattle;
import model.battle.map.Point;

import java.util.ArrayList;

public class MapLogic {

    private final int numberOfRows;
    private final int numberOfColumns;
    private final Point startingCoordinates;
    private final Point targetCoordinates;
    private CellLogic[][] tableOfCell;
    private int[][] stepCountFromTarget;
    private MapBattle mapBattle;

    public MapLogic(MapBattle mapBattle) {
        numberOfRows = BattleConfig.ROWS;
        numberOfColumns = BattleConfig.COLUMNS;
        startingCoordinates = BattleConfig.STARTING_POINT;
        targetCoordinates = BattleConfig.TARGET_POINT;
        tableOfCell = new CellLogic[BattleConfig.ROWS][BattleConfig.COLUMNS];
        stepCountFromTarget = new int[BattleConfig.ROWS + 2][BattleConfig.COLUMNS + 2];
        this.mapBattle = mapBattle;

        initMap();
    }

    public void initMap() {
        for (int i = 0; i < numberOfRows; i++) {
            for (int j = 0; j < numberOfColumns; j++) {
                tableOfCell[i][j] = new CellLogic();
                tableOfCell[i][j].type = BattleConfig.LAND_TYPE;
                tableOfCell[i][j].buff = BattleConfig.NO_BUFF;
            }
        }

        // Add hold
        for (int i = 0; i < mapBattle.getListHole().length; i++) {
            Point position = mapBattle.getListHole()[i].point;
            addObstacle(position.getX(), position.getY(), BattleConfig.HOLE_TYPE);
        }

        // Add tree
        for (int i = 0; i < mapBattle.getListTree().length; i++) {
            Point position = mapBattle.getListTree()[i].point;
            addObstacle(position.getX(), position.getY(), BattleConfig.TREE_TYPE);
        }

        // Add buff
        for (int i = 0; i < mapBattle.getListBuff().length; i++) {
            Point position = mapBattle.getListBuff()[i].point;
            int type = mapBattle.getListBuff()[i].type;
            addBuffType(position.getX(), position.getY(), type);
        }

        updateStepCountFromTarget();
//        showTable();
    }

    public void showTable() {
        System.out.println("----- Table of cell -----");
        for (int i = 0; i < tableOfCell.length; i++) {
            for (int j = 0; j < tableOfCell[i].length; j++) {
                System.out.print("("+tableOfCell[i][j].type + " ; " + tableOfCell[i][j].buff + ")     ");
            }
            System.out.println();
        }

        System.out.println("----- Step Count From Target -----");
        for (int i = 0; i < stepCountFromTarget.length; i++) {
            for (int j = 0; j < stepCountFromTarget[i].length; j++) {
                System.out.print(stepCountFromTarget[i][j] + "     ");
            }
            System.out.println();
        }
    }

    public void addBuffType(int x, int y, int type){
        tableOfCell[x][y].buff = type;
    }

    public void addObstacle(int x, int y, int type) {
        tableOfCell[x][y].type = type;
    }

    // Lấy type ở ô (x,y)
    public int getTypeOfCell(int x,int y) {
//        //o gate
//        if (x == -1 && y == 1) return BattleConfig.LAND_TYPE;
        // O canh monster gate
        if (x == -1 && y == 0) return BattleConfig.LAND_TYPE;
        // O house
        if (x == BattleConfig.ROWS - 1 && y == BattleConfig.COLUMNS) return BattleConfig.LAND_TYPE;

        if (x == -1 || y == -1 || x == BattleConfig.ROWS || y == BattleConfig.COLUMNS) return BattleConfig.TMP_TYPE;
        return tableOfCell[x][y].type;
    }

    // Kiem tra xem sau khi them vat can vao o (x,y) thi co duong den tu diem dau den diem dich hay khong
    public boolean isCanMoveToTargetPointAfterAddObstacle(int x, int y) {
        if (x == startingCoordinates.getX() && y == startingCoordinates.getY()){
            return false;
        }
        if (x == targetCoordinates.getX() && y == targetCoordinates.getY()) {
            return false;
        }
        addObstacle(x, y, BattleConfig.TMP_TYPE);
        boolean isExistPath = isExistPathOfMonster(startingCoordinates.getX(), startingCoordinates.getY());
        addObstacle(x, y, BattleConfig.LAND_TYPE);
        return isExistPath;
    }

    // Kiem tra xem con duong di cho quai vat tu (x,y) den dich khong
    public boolean isExistPathOfMonster(int x,int y){
        Point[][] tracePath = new Point[numberOfRows][numberOfColumns];
        for (int i = 0; i < numberOfRows; i++) {
            for (int j = 0; j < numberOfColumns; j++) {
                tracePath[i][j] = new Point(BattleConfig.FLAG_TRACE_INIT,BattleConfig.FLAG_TRACE_INIT);
            }
        }
        Point startingPoint = new Point(x,y);
        Point targetPoint = new Point(BattleConfig.TARGET_POINT.getX(), BattleConfig.TARGET_POINT.getY()-1);
        Queue queue = new Queue();

        // Tim duong tu diem (x,y)
        queue.enqueue(startingPoint);
        tracePath[startingPoint.getX()][startingPoint.getY()] = new Point(BattleConfig.FLAG_TRACE_CHECKED, BattleConfig.FLAG_TRACE_CHECKED);

        // Bat dau tim duong di su dung thuat toan BFS
        while (!queue.isEmpty()) {
            Point currentPoint = (Point) queue.dequeue();
            if (currentPoint.getX() == targetPoint.getX() && currentPoint.getY() == targetPoint.getY()) {
                return true;
            }
            for (int i = 0; i < BattleConfig.LIST_4_DIRECTION.length; i++) {
                Point nextPoint = new Point(currentPoint.getX() + BattleConfig.LIST_4_DIRECTION[i].getX(),
                        currentPoint.getY() + BattleConfig.LIST_4_DIRECTION[i].getY());
                if (nextPoint.getX() >= 0 && nextPoint.getX() < numberOfRows && nextPoint.getY()>=0 && nextPoint.getY() < numberOfColumns) {
                    if (this.getTypeOfCell(nextPoint.getX(), nextPoint.getY()) == BattleConfig.LAND_TYPE
                            && tracePath[nextPoint.getX()][nextPoint.getY()].getX() == BattleConfig.FLAG_TRACE_INIT) {
                        tracePath[nextPoint.getX()][nextPoint.getY()] = currentPoint;
                        queue.enqueue(new Point(nextPoint.getX(), nextPoint.getY()));
                    }
                }
            }
        }
        return false;
    }

    public int getPriorityDirectionOfNextPoint(Point previousPoint, Point currentPoint){
        if (previousPoint.getX() < BattleConfig.STARTING_POINT.getX()
                || previousPoint.getX() + 1 == currentPoint.getX()) {
            return BattleConfig.BOTTOM_NEIGHBOR_INDEX;
        }
        if (previousPoint.getX() - 1 == currentPoint.getX()) {
            return BattleConfig.TOP_NEIGHBOR_INDEX;
        }
        if (previousPoint.getY() + 1 == currentPoint.getY()) {
            return BattleConfig.RIGHT_NEIGHBOR_INDEX;
        }
        return BattleConfig.LEFT_NEIGHBOR_INDEX;
    }

    // Xu ly khi diem tiep theo theo chieu doc
    public Point getNextPointOfPathVertical(Point previousPoint,int x,int y) {
        if (stepCountFromTarget[previousPoint.getX() + 1][previousPoint.getY() + 1] == stepCountFromTarget[x + 1][y + 1] + BattleConfig.COST_STRAIGHT_DIJKSTRA) {
            if (x+1 < numberOfRows && getTypeOfCell(x+1,y) == BattleConfig.LAND_TYPE && previousPoint.getX() < x) {
                return new Point(x + 1, y);
            }
            if (x-1 >=0 && getTypeOfCell(x-1,y) == BattleConfig.LAND_TYPE && previousPoint.getX() > x) {
                return new Point(x - 1, y);
            }
        }
        if (stepCountFromTarget[previousPoint.getX() + 1][previousPoint.getY() + 1] == stepCountFromTarget[x + 1][y + 1] + BattleConfig.COST_TURN_DIJKSTRA + BattleConfig.COST_STRAIGHT_DIJKSTRA) {
            int maxColumn = numberOfColumns;
            if (x == BattleConfig.ROWS-1) {
                maxColumn ++;
            }
            if (y-1>=0 && y+1 < maxColumn && getTypeOfCell(x,y-1) == BattleConfig.LAND_TYPE && getTypeOfCell(x,y+1) == BattleConfig.LAND_TYPE){
                if (stepCountFromTarget[x + 1][y + 1 + 1] > stepCountFromTarget[x + 1][y - 1 + 1]){
                    return new Point(x,y-1);
                }
                if (stepCountFromTarget[x + 1][y + 1 + 1] < stepCountFromTarget[x + 1][y - 1 + 1]){
                    return new Point(x,y+1);
                }
            }
            if (y-1>=0 && getTypeOfCell(x,y-1) == BattleConfig.LAND_TYPE) {
                return new Point(x,y-1);
            }
            if (y+1 < maxColumn && getTypeOfCell(x,y+1) == BattleConfig.LAND_TYPE) {
                return new Point(x, y+1);
            }
        }
        return new Point(-1, -1);
    }

    // Xu ly khi diem tiep theo theo chieu ngang
    public Point getNextPointOfPathHorizontal(Point previousPoint,int x,int y) {
        if (stepCountFromTarget[previousPoint.getX() + 1][previousPoint.getY() + 1] == stepCountFromTarget[x + 1][y + 1] + BattleConfig.COST_STRAIGHT_DIJKSTRA) {
            int maxColumn = numberOfColumns;
            if (x == BattleConfig.ROWS-1) {
                maxColumn ++;
            }
            if (y+1 < maxColumn && getTypeOfCell(x,y+1) == BattleConfig.LAND_TYPE && previousPoint.getY() < y) {
                return new Point(x , y + 1);
            }
            if (y-1 >=0 && getTypeOfCell(x,y-1) == BattleConfig.LAND_TYPE && previousPoint.getY() > y) {
                return new Point(x , y - 1);
            }
        }
        if (stepCountFromTarget[previousPoint.getX() + 1][previousPoint.getY() + 1] == stepCountFromTarget[x + 1][y + 1] + BattleConfig.COST_TURN_DIJKSTRA + BattleConfig.COST_STRAIGHT_DIJKSTRA) {
            if (x-1 >=0 && x+1< numberOfRows && getTypeOfCell(x-1,y) == BattleConfig.LAND_TYPE && getTypeOfCell(x+1,y) == BattleConfig.LAND_TYPE) {
                if (stepCountFromTarget[x + 1 + 1][y + 1] > stepCountFromTarget[x - 1 + 1][y + 1]){
                    return new Point(x - 1,y);
                }
                if (stepCountFromTarget[x + 1 + 1][y + 1] < stepCountFromTarget[x - 1 + 1][y + 1]){
                    return new Point(x+1,y);
                }
            }
            if (x-1 >=0 && getTypeOfCell(x-1,y) == BattleConfig.LAND_TYPE) {
                return new Point(x-1, y);
            }
            if (x+1 < numberOfRows && getTypeOfCell(x+1,y) == BattleConfig.LAND_TYPE) {
                return new Point(x+1, y);
            }
        }
        return new Point(-1, -1);
    }

    public Point getNextPointOfPath(Point previousPoint,int x,int y) {
        if (x == BattleConfig.STARTING_POINT.getX()-1 && y == BattleConfig.STARTING_POINT.getY()) {
            return BattleConfig.STARTING_POINT;
        }

        // Xet truong hop di doc
        if (previousPoint.getY() == y) {
            return getNextPointOfPathVertical(previousPoint,x,y);
        }

        // Xet truong hop di ngang
        if (previousPoint.getX() == x) {
            return getNextPointOfPathHorizontal(previousPoint,x,y);
        }

        return new Point(-1,-1);
    }

    public Point getNextPointOfMonster(Point previousPoint, int x, int y) {
        if (x == BattleConfig.STARTING_POINT.getX()-1 && y == BattleConfig.STARTING_POINT.getY()+1) {
            return new Point(BattleConfig.STARTING_POINT.getX()-1, BattleConfig.STARTING_POINT.getY());
        }
        if (x == BattleConfig.STARTING_POINT.getX()-1 && y == BattleConfig.STARTING_POINT.getY()) {
            return new Point(BattleConfig.STARTING_POINT.getX(),BattleConfig.STARTING_POINT.getY());
        }

        Point nextPointByFindPath = getNextPointOfPath(previousPoint,x,y);
        Point nextPoint = new Point(-1,-1);
        int stepCountOfNextPoint = BattleConfig.BIG_NUMBER;

        // Tao mang double direction = 2 lan mang 4_direction
        Point[] doubleDirection = new Point[BattleConfig.LIST_4_DIRECTION.length * 2];
        int pos = 0;
        for (Point element : BattleConfig.LIST_4_DIRECTION) {
            doubleDirection[pos] = element;
            pos++;
        }
        for (Point element : BattleConfig.LIST_4_DIRECTION) {
            doubleDirection[pos] = element;
            pos++;
        }


        int priorityDirection = getPriorityDirectionOfNextPoint(previousPoint, new Point(x,y));
        for (int i = priorityDirection; i < priorityDirection + BattleConfig.LIST_4_DIRECTION.length; i++) {
            Point tmpNextPoint = new Point(x + doubleDirection[i].getX(), y + doubleDirection[i].getY());
            if (tmpNextPoint.getX() >= -1 && tmpNextPoint.getX() <= numberOfRows
                    && tmpNextPoint.getY()>=-1 && tmpNextPoint.getY() <= numberOfColumns) {
                if (stepCountFromTarget[tmpNextPoint.getX()+1][tmpNextPoint.getY()+1] < stepCountOfNextPoint) {
                    stepCountOfNextPoint = stepCountFromTarget[tmpNextPoint.getX()+1][tmpNextPoint.getY()+1];
                    nextPoint = new Point(tmpNextPoint.getX(),tmpNextPoint.getY());
                }
            }
        }

        if (nextPointByFindPath.getX() != -1) {
            if (stepCountFromTarget[nextPointByFindPath.getX()+1][nextPointByFindPath.getY()+1] >
                    stepCountFromTarget[nextPoint.getX()+1][nextPoint.getY()+1]) {
                return nextPoint;
            } else {
                return nextPointByFindPath;
            }
        }
        return nextPoint;
    }

    public void updateStepCountFromTarget() {
        stepCountFromTarget = getStepCountTableFromTarget(BattleConfig.TARGET_POINT);
    }

    public int getBuffOfCell(int x, int y) {
        return this.tableOfCell[x][y].buff;
    }

    // Su dung thuat toan Dijkstra
    public int[][] getStepCountTableFromTarget(Point target){
        int[][] stepCount = new int[BattleConfig.ROWS + 2][BattleConfig.COLUMNS + 2];
        ArrayList<Point>[][] listParentCoordinate = new ArrayList[BattleConfig.ROWS + 2][BattleConfig.COLUMNS + 2];

        // Bat dau tu vi tri (-1,0) do do cac mang se duoc them 2 cot va 2 dong
        for (int i = 0; i < numberOfRows+2; i++) {
            for (int j = 0; j < numberOfColumns+2; j++) {
                stepCount[i][j] = BattleConfig.BIG_NUMBER;
                listParentCoordinate[i][j] = new ArrayList<>();
            }
        }

        Point targetPoint = new Point(target.getX()+1, target.getY()+1);
        PriorityQueue priorityQueue = new PriorityQueue();
        stepCount[targetPoint.getX()][targetPoint.getY()] = 0;
        priorityQueue.enqueue(new PointOfPriorityQueue(stepCount[targetPoint.getX()][targetPoint.getY()], targetPoint));
        listParentCoordinate[targetPoint.getX()][targetPoint.getY()].add(new Point(-1,-1));

        // Thuat toan Dijkstra
        while (!priorityQueue.isEmpty()){
            PointOfPriorityQueue currentPoint = priorityQueue.dequeue();
            for (int i = 0; i < BattleConfig.LIST_4_DIRECTION.length; i++) {
                Point nextPoint = new Point(currentPoint.currentCoordinate.getX() + BattleConfig.LIST_4_DIRECTION[i].getX(),
                        currentPoint.currentCoordinate.getY() + BattleConfig.LIST_4_DIRECTION[i].getY());

                if (nextPoint.getX() >= 0 && nextPoint.getX() < numberOfRows+2 && nextPoint.getY()>=0 && nextPoint.getY() < numberOfColumns+2 && getTypeOfCell(nextPoint.getX()-1, nextPoint.getY()-1) == BattleConfig.LAND_TYPE) {
                    int cost = getCost(nextPoint, listParentCoordinate[currentPoint.currentCoordinate.getX()][currentPoint.currentCoordinate.getY()]);

                    if (stepCount[nextPoint.getX()][nextPoint.getY()] == stepCount[currentPoint.currentCoordinate.getX()][currentPoint.currentCoordinate.getY()] + cost) {
                        listParentCoordinate[nextPoint.getX()][nextPoint.getY()].add(new Point(currentPoint.currentCoordinate.getX(), currentPoint.currentCoordinate.getY()));
                    }
                    if (stepCount[nextPoint.getX()][nextPoint.getY()] > stepCount[currentPoint.currentCoordinate.getX()][currentPoint.currentCoordinate.getY()] + cost) {

                        stepCount[nextPoint.getX()][nextPoint.getY()] = stepCount[currentPoint.currentCoordinate.getX()][currentPoint.currentCoordinate.getY()] + cost;

                        listParentCoordinate[nextPoint.getX()][nextPoint.getY()].clear();
                        listParentCoordinate[nextPoint.getX()][nextPoint.getY()].add(new Point(currentPoint.currentCoordinate.getX(), currentPoint.currentCoordinate.getY()));

                        priorityQueue.enqueue(new PointOfPriorityQueue(stepCount[nextPoint.getX()][nextPoint.getY()], nextPoint));
                    }
                }
            }
        }
        return stepCount;
    }

    // Chi phi de di tu diem current den diem next
    // Neu tu previous den next la re nhanh thi cost = BATTLE.COST_TURN_DIJKSTRA + BATTLE.COST_STRAIGHT_DIJKSTRA
    // nguoc lai thi cost = BATTLE.COST_STRAIGHT_DIJKSTRA
    public int getCost(Point nextPoint, ArrayList<Point> listParentCoordinate) {
        for (int i = 0; i < listParentCoordinate.size(); i++) {
            if (listParentCoordinate.get(i).getX() == -1) {
                return BattleConfig.COST_STRAIGHT_DIJKSTRA;
            }
            if (nextPoint.getX() == listParentCoordinate.get(i).getX() || nextPoint.getY() == listParentCoordinate.get(i).getY()) {
                return BattleConfig.COST_STRAIGHT_DIJKSTRA;
            }
        }
        return BattleConfig.COST_TURN_DIJKSTRA + BattleConfig.COST_STRAIGHT_DIJKSTRA;
    }
}
