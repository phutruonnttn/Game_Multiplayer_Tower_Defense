package model.battle.map;

public class Hole {
    public Point point;
    Hole(Point pos){
        point = pos;
    }
    @Override
    public String toString(){
        return "Hole";
    }
}
