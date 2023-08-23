package model.battle.map;

public class Tree{
    public Point point;
    public Tree(Point pos){
        point = pos;
    }
    @Override
    public String toString(){
        return "tree";
    }
}
