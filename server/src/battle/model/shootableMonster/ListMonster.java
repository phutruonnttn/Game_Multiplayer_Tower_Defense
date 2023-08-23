package battle.model.shootableMonster;

import battle.model.Cell;

import java.util.ArrayList;

public class ListMonster {

    ArrayList<Monster> arrMonster = new ArrayList<Monster>();
    Cell cell;

    public ListMonster(Cell cell) {
        this.cell = cell;
    }

    public void addMonster(Monster monster) {
        this.arrMonster.add(monster);
    }

    public void removeMonster(Monster monster) {
        this.arrMonster.remove(monster);
    }


    public ArrayList<Monster> getMonsters() {
        return this.arrMonster;
    }
}