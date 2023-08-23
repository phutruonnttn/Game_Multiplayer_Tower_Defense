package model.battle.map;

public class Buff{
    public Point point;
    public int type;
    public Buff(Point p, int type){
        point = p;
        this.type = type;
    }

    @Override
    public String toString(){
        return "buff";
    }
}
