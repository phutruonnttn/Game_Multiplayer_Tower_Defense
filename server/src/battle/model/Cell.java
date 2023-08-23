package battle.model;

import battle.model.shootableMonster.ListMonster;
import battle.model.shootableMonster.Monster;
import battle.model.tower.tower.Tower;
import model.battle.map.Point;

import java.util.ArrayList;

public class Cell {

    public Tower tower;
    public Obstacle obstacle;
    public ListMonster monsters;
    public Point point;

    public Cell(int x, int y){
        this.point = new Point(x, y);
        this.monsters = new ListMonster(this);
    }

    public ArrayList<Monster> getMonstersInCell(){
        return this.monsters.getMonsters();
    }

    public  void removeMonster(Monster monster){this.monsters.removeMonster(monster);}
    public void addMonster(Monster monster){
        this.monsters.addMonster(monster);
    }
}

