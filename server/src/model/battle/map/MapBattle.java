package model.battle.map;

import battle.model.shootableMonster.Monster;
import config.battle.MapConfig;
import util.RandomNumber;

import java.util.ArrayList;

public class MapBattle {
    static int widthMap = MapConfig.widthMap;
    static int heightMap = MapConfig.heightMap;
    private Hole[] listHole = new Hole[MapConfig.numberHole];
    private Monster[] listMonster;
    private Buff[] listBuff = new Buff[MapConfig.numberBuff];
    private Object[][] objectMap = new Object[heightMap][widthMap];
    private Router router = new Router();
    private int[][] routerMap = new int[heightMap][widthMap];
    private BaseMap baseMap;

    private Tree[] listTree ;

    public BaseMap getBaseMap() {
        return baseMap;
    }

    public Tree[] getListTree() {
        return listTree;
    }

    public Hole[] getListHole() {
        return listHole;
    }

    public Buff[] getListBuff() {
        return listBuff;
    }

    public MapBattle() {
        this.baseMap = BaseMap.getRandomBaseMap();
        listTree = new Tree[RandomNumber.getNumberInRange(0, MapConfig.maxTree)];
        addBuff();
        addTree();
        addHole();

    }


    private void addBuff() {
        Point p;
        int[] arrBuff = MapConfig.listBuff[RandomNumber.getNumberInRange(0, 5)];
        for(int i = 0; i < this.baseMap.listBuff.length; i++) {
            p = this.baseMap.listBuff[arrBuff[i]];
            listBuff[i] = new Buff(new Point(p.x, p.y), i);
            objectMap[p.x][p.y] = listBuff[i];
        }
    }

    private void addTree() {
        ArrayList<Point> listZigzag = getZigzagPoint();
        int nTree = RandomNumber.getNumberInRange(0, MapConfig.maxTree);
        Tree arrTree[] = new Tree[nTree];
        int [] arr = RandomNumber.getRangeShuffle(listZigzag.size() - 1);
        int k = 0;
        for(int i : arr){
            Point curP = listZigzag.get(i);
            Point[] neighbor = getNeighbor(curP.x, curP.y);
            for (Point p : neighbor){
                if(k >= nTree){
                    break;
                }
                if(p == null || inVirtualPath(p) || isTree(p) || isHole(p) || isBuff(p)){
                    continue;
                }
                Point[] neighborP = getNeighbor(p.x, p.y);
                boolean status = true;
                for(Point o : neighborP){
                    if(isTree(o) || isHole(o) || isBuff(o)){
                        status = false;
                    }
                }
                if(status){
                    arrTree[k] = new Tree(p);
                    objectMap[p.x][p.y] = arrTree[k];
                    routerMap[p.x][p.y] = 1;
                    k++;
                }
            }
        }
        int l = 0;
        for(int i = 0; i < arrTree.length; i++){
            if(arrTree[i]!=null) l++;
        }
        listTree = new Tree[l];
        int j = 0;
        for(int i = 0; i < arrTree.length; i++){
            if(arrTree[i]!=null) listTree[j++] = arrTree[i];
        }

    }

    private void addHole() {
        Point[] virtualPath = this.baseMap.virtualPath;
        int [] arr = RandomNumber.getRangeShuffle( virtualPath.length - 1);
        int k = 0;
        for(int i : arr){
            Point curP = virtualPath[i];
            Point[] neighbor = getNeighbor(curP.x, curP.y);
            for (Point p : neighbor){
                if(k >= MapConfig.numberHole){
                    break;
                }
                if(p == null || inVirtualPath(p) || isTree(p) || isHole(p) || isBuff(p)){
                    continue;
                }
                Point[] neighborP = getNeighbor(p.x, p.y);
                boolean status = true;
                for(Point o : neighborP){
                    if(isTree(o) || isBuff(o)){
                        status = false;
                    }
                }
                if(status){
                    listHole[k] = new Hole(p);
                    objectMap[p.x][p.y] = listHole[k];
                    routerMap[p.x][p.y] = 1;
                    k++;
                }
            }
        }


    }


    private Point[] getNeighbor(int x, int y){
        Point[] neighborList = new Point[4];
        int k = 0;
        if(x + 1 < heightMap){
            neighborList[k] = new Point(x+1,y);
        }
        k++;
        if (y + 1 < widthMap){
            neighborList[k] = new Point(x, y+1);
        }
        k++;
        if(x - 1 >= 0){
            neighborList[k] = new Point(x-1, y);
        }
        k++;
        if (y - 1 >= 0){
            neighborList[k] = new Point(x, y-1);
        }
        return neighborList;//r,b,l,t
    }

    boolean isTree(Point p){
        if(p == null){
            return false;
        }
        if(objectMap[p.x][p.y] instanceof Tree){
            return true;
        };
        return false;
    }

    boolean isHole(Point p){
        if(p == null){
            return false;
        }
        if(objectMap[p.x][p.y] instanceof Hole){
            return true;
        };
        return false;
    }

    boolean isBuff(Point p){
        if(p == null){
            return false;
        }
        if(objectMap[p.x][p.y] instanceof Buff){
            return true;
        };
        return false;
    }

     boolean inVirtualPath(Point p){
        for (Point point : this.baseMap.virtualPath){
            if(p.compareTo(point) == 0){
                return true;
            }
        }
        return false;
    }

    ArrayList<Point> getZigzagPoint(){
        ArrayList<Point> listZigzag = new ArrayList<>();
        Point[] virtualPath = this.baseMap.virtualPath;
        for(int i = 1; i < virtualPath.length-1; i++){
            if(!(virtualPath[i-1].x == virtualPath[i+1].x || virtualPath[i-1].y == virtualPath[i+1].y)){
                listZigzag.add(virtualPath[i]);
            }
        }
        return listZigzag;
    }

}
