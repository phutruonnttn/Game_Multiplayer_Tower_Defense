package model.battle.map;

public class Point implements Comparable<Point>{
    int x;
    int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    @Override
    public int compareTo(Point o) {
        if (x == o.x && y == o.y){
            return 0;
        }else {
            return 1;
        }
    }

    @Override
    public String toString(){
        return "{ x:" +this.x+", y:"+ this.y +" }\n";
    }
}
