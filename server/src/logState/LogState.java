package logState;

import battle.GameMgr;
import battle.model.Obstacle;
import battle.model.shootableMonster.Monster;
import battle.model.tower.tower.Tower;
import battle.model.tower.towerAttack.TowerAttack;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;

public class LogState {

    private static LogState single_instance = null;

    public static LogState getInstance() {
        if (single_instance == null) {
            single_instance = new LogState();
        }
        return single_instance;
    }

    public void logToFile(GameMgr gameMgr, int countLoop){
        String content = "";

        // Log monster
        content += "Number of monster: " + gameMgr.listMonster.size();
        content += "\n   [id - x - y - current speed - current HP]";
        double sumMonster = 0;
        ArrayList<Monster> arrMonster = gameMgr.getListMonsterInNeighborCell(2, 5, 10);
        for (int i = 0; i < arrMonster.size(); i++) {
            content += "\n" + i + ". ["
                    + arrMonster.get(i).id + " - "
                    + String.format("%.3f", arrMonster.get(i).position.getX()) + " - "
                    + String.format("%.3f", arrMonster.get(i).position.getY()) + " - "
                    + String.format("%.3f", arrMonster.get(i).curSpeed) + " - "
                    + String.format("%.3f", arrMonster.get(i).currentHP)+ "]";

            sumMonster += arrMonster.get(i).id
                    + arrMonster.get(i).position.getX()
                    + arrMonster.get(i).position.getY()
                    + arrMonster.get(i).curSpeed
                    + arrMonster.get(i).currentHP;
        }

        // Log obstacle
        content += "\n\n\nNumber of tree: " + gameMgr.listTreeObstacle.size();
        content += "\n   [id - x - y - current HP]";
        double sumTree = 0;
        ArrayList<Obstacle> arrTree = gameMgr.listTreeObstacle;
        for (int i = 0; i < arrTree.size(); i++) {
            content += "\n" + i + ". ["
                    + arrTree.get(i).id + " - "
                    + String.format("%.3f", arrTree.get(i).position.getX()) + " - "
                    + String.format("%.3f", arrTree.get(i).position.getY()) + " - "
                    + String.format("%.3f", arrTree.get(i).currentHP)+ "]";

            sumTree += arrTree.get(i).id
                    + arrTree.get(i).position.getX()
                    + arrTree.get(i).position.getY()
                    + arrTree.get(i).currentHP;
        }

        // Log tower
        content += "\n\n\nNumber of tower: " + gameMgr.listTower.size();
        content += "\n   [towerID - x - y - evolution]";
        double sumTower = 0;
        for (int i = 0; i < gameMgr.listTower.size(); i++) {
            content += "\n" + i + ". ["
                    + gameMgr.listTower.get(i).towerID + " - "
                    + String.format("%.3f", gameMgr.listTower.get(i).x) + " - "
                    + String.format("%.3f", gameMgr.listTower.get(i).y) + " - "
                    + gameMgr.listTower.get(i).evolution+ "]";

            sumTower += gameMgr.listTower.get(i).towerID
                    + gameMgr.listTower.get(i).x
                    + gameMgr.listTower.get(i).y
                    + gameMgr.listTower.get(i).evolution;

            Tower tower = gameMgr.listTower.get(i);
            if (tower instanceof TowerAttack) {
                int targetID = (((TowerAttack) tower).getTarget() instanceof Monster ? ((Monster) ((TowerAttack) tower).getTarget()).getId() : -1);
                content += " - target: " + targetID;
                sumTower += targetID;
                content += " - range: " + String.format("%.3f", tower.getRange());
                sumTower += tower.getRange();
                content += " - damage: " + String.format("%.3f", ((TowerAttack) tower).getDamage());
                sumTower += ((TowerAttack) tower).getDamage();
                content += " - attackSpeed: " + String.format("%.3f", ((TowerAttack) tower).getAttackSpeed());
                sumTower += ((TowerAttack) tower).getAttackSpeed();
            }
        }

        // Log bullet
        content += "\n\n\nNumber of bullet: " + gameMgr.listBullet.size();
        content += "\n   [x - y - damage - speed]";
        double sumBullet = 0;
        for (int i = 0; i < gameMgr.listBullet.size(); i++) {
            content += "\n" + i + ". ["
                    + String.format("%.3f",gameMgr.listBullet.get(i).x) + " - "
                    + String.format("%.3f",gameMgr.listBullet.get(i).y) + " - "
                    + String.format("%.3f",gameMgr.listBullet.get(i).damage) + " - "
                    + String.format("%.3f",gameMgr.listBullet.get(i).speed) + "]";

            sumBullet += gameMgr.listBullet.get(i).x
                    + gameMgr.listBullet.get(i).y
                    + gameMgr.listBullet.get(i).damage
                    + gameMgr.listBullet.get(i).speed;
        }

        // Round
        String contentSum = String.format("%.3f",sumMonster) + "\n"
                            + String.format("%.3f",sumTree) + "\n"
                            + String.format("%.3f",sumTower) + "\n"
                            + String.format("%.3f",sumBullet) + "\n"
                            + gameMgr.currentEnergy;

        logState(content, gameMgr.user.getId(), countLoop);
        logSumState(contentSum, gameMgr.user.getId(), countLoop);
    }

    public void logState(String content, int id, int countLoop) {
        try {
            // Make new directory
            String dir = "../logServer/logState/user" + id;
            File theDir = new File(dir);
            if (!theDir.exists()){
                theDir.mkdirs();
            }

            // Make new file
            String path = dir + "/"+ countLoop + "-server-stateFrame.txt";
            File file = new File(path);
            file.createNewFile();

            // Write file
            FileWriter fw = new FileWriter(path, false);// ghi de
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write(content);
            bw.close();

        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public void logSumState(String content, int id, int countLoop) {
        try {
            // Make new directory
            String dir = "../logServer/logSumState/user" + id;
            File theDir = new File(dir);
            if (!theDir.exists()){
                theDir.mkdirs();
            }

            // Make new file
            String path = dir + "/" + countLoop + "-server-sumStateFrame.txt";
            File file = new File(path);
            file.createNewFile();

            // Write file
            FileWriter fw = new FileWriter(path, false);// ghi de
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write(content);
            bw.close();

        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
