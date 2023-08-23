package battle.model.shootableMonster.bat;

import battle.GameMgr;
import battle.model.shootableMonster.Monster;
import battle.model.shootableMonster.config.MonsterType;
import config.battle.BattleConfig;
import model.battle.map.Point;
import model.battle.map.Position;


public class Bat extends Monster {

    public Bat(int lever, GameMgr gameMgr, int id, int HPRatio, boolean isMonsterDrop) {

        super(MonsterType.BAT, lever, gameMgr, id, HPRatio, isMonsterDrop);
    }

    @Override
    public Point getNextPoint(){

        if(this.curPoint.getX() == -1 && this.curPoint.getY() == 1){
            return new Point(-1, 0);
        }

        if(this.curPoint.getX() == -1 && this.curPoint.getY() == 0){
            return new Point(0, 0);
        }
        if(this.curPoint.getX() == 4 && this.curPoint.getY() == 6){
            return new Point(4, 7);
        }

        Point nextPoint = new Point(this.curPoint.getX() + 1, this.curPoint.getY() + 1);

        if(nextPoint.getX() >= BattleConfig.ROWS){
            nextPoint.setX(BattleConfig.ROWS - 1);
        }

        if(nextPoint.getY() >=  BattleConfig.COLUMNS){
            nextPoint.setY(BattleConfig.COLUMNS - 1);
        }

        return nextPoint;

    }

    @Override
    public void move(double dt){
        if(this.curPoint.getX() != this.nextPoint.getX()
                && this.curPoint.getY() != this.nextPoint.getY()){
            this.moveDown(dt/1.41);
            this.moveUp(dt/1.41);
            this.moveLeft(dt/1.41);
            this.moveRight(dt/1.41);
        }else{
            this.moveDown(dt);
            this.moveUp(dt);
            this.moveLeft(dt);
            this.moveRight(dt);
        }
    }

    @Override
    public Position getTargetPositionOfCell(){
        return getCentralOfCell(this.nextPoint);
    }

}
