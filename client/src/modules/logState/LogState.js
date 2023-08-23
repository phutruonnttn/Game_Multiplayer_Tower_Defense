var LogState = cc.Class.extend({

    ctor: function () {
        this.flag = false;
        this.dirState = "../logClient/logState/user" + gv.user.id + "/"
        this.dirSumState = "../logClient/logSumState/user" + gv.user.id + "/"
        jsb.fileUtils.createDirectory(this.dirState)
        jsb.fileUtils.createDirectory(this.dirSumState)

        this.deltaMonster = 0.1;
        this.deltaTree = 0.1;
        this.deltaTower = 0.1;
        this.deltaBullet = 0.1;
        this.deltaEnergy = 0.1;
    },

    logToFile: function (gameMgr, countLoop) {
        var content = ""

        // Log monster
        content += "Number of monster: " + gameMgr.listLogicMonster.length
        content += "\n   [id - x - y - current speed - current HP]"
        var sumMonster = 0
        let listMonster = gameMgr.getListMonsterInCellNeighbor(2, 5, 10);
        for (var i = 0; i < listMonster.length; i++) {
            content += "\n" + i + ". ["
                + listMonster[i].id + " - "
                + listMonster[i].position.x.toFixed(3) + " - "
                + listMonster[i].position.y.toFixed(3) + " - "
                + listMonster[i].curSpeed.toFixed(3) + " - "
                + listMonster[i].currentHP.toFixed(3) + "]"

            sumMonster += listMonster[i].id
                + listMonster[i].position.x
                + listMonster[i].position.y
                + listMonster[i].curSpeed
                + listMonster[i].currentHP
        }

        // Log tree
        content += "\n\n\nNumber of tree: " + gameMgr.listLogicTreeObstacle.length
        content += "\n   [id - x - y - current HP]"
        var sumTree = 0
        let listTree = gameMgr.listLogicTreeObstacle;
        for (var i = 0; i < listTree.length; i++) {
            content += "\n" + i + ". ["
                + listTree[i].id + " - "
                + listTree[i].position.x.toFixed(3) + " - "
                + listTree[i].position.y.toFixed(3) + " - "
                + listTree[i].currentHP.toFixed(3) + "]"

            sumTree += listTree[i].id
                + listTree[i].position.x
                + listTree[i].position.y
                + listTree[i].currentHP
        }

        // Log tower
        content += "\n\n\nNumber of tower: " + gameMgr.listLogicTower.length
        content += "\n   [towerID - x - y - evolution]"
        var sumTower = 0
        for (var i = 0; i < gameMgr.listLogicTower.length; i++) {
            content += "\n" + i + ". ["
                + gameMgr.listLogicTower[i].towerID + " - "
                + gameMgr.listLogicTower[i].x.toFixed(3) + " - "
                + gameMgr.listLogicTower[i].y.toFixed(3) + " - "
                + gameMgr.listLogicTower[i].evolution + "]"

            sumTower += gameMgr.listLogicTower[i].towerID
                + gameMgr.listLogicTower[i].x
                + gameMgr.listLogicTower[i].y
                + gameMgr.listLogicTower[i].evolution

            let tower = gameMgr.listLogicTower[i];
            if (tower instanceof TowerLogicAttack) {
                let targetID = tower.getTarget() instanceof LogicMonster ? tower.getTarget().getId() : -1;
                content += " - target: " + targetID;
                sumTower += targetID;
                content += " - range: " + tower.getRange().toFixed(3);
                sumTower += tower.getRange();
                content += " - damage: " + tower.getDamage().toFixed(3);
                sumTower += tower.getDamage();
                content += " - attackSpeed: " + tower.getAttackSpeed().toFixed(3);
                sumTower += tower.getAttackSpeed();
            }
        }

        // Log bullet
        content += "\n\n\nNumber of bullet: " + gameMgr.listLogicBullet.length
        content += "\n   [x - y - damage - speed]"
        var sumBullet = 0
        for (var i = 0; i < gameMgr.listLogicBullet.length; i++) {
            content += "\n" + i + ". ["
                + gameMgr.listLogicBullet[i].x.toFixed(3) + " - "
                + gameMgr.listLogicBullet[i].y.toFixed(3) + " - "
                + gameMgr.listLogicBullet[i].damage.toFixed(3) + " - "
                + gameMgr.listLogicBullet[i].speed.toFixed(3) + "]"

            sumBullet += gameMgr.listLogicBullet[i].x
                + gameMgr.listLogicBullet[i].y
                + gameMgr.listLogicBullet[i].damage
                + gameMgr.listLogicBullet[i].speed
        }

        var energy = gameMgr.currentEnergy;

        // Get path
        var pathState = this.dirState + "/"+ countLoop +"-client-stateFrame.txt"
        var pathSumState = this.dirSumState + "/"+ countLoop +"-client-sumStateFrame.txt"

        this.dirSumStateServer = "../logServer/logSumState/user" + gv.user.id + "/"
        var pathSumStateServer = this.dirSumStateServer + "/"+ countLoop +"-server-sumStateFrame.txt"

        // Compare with server state
        var sumStateServer = jsb.fileUtils.getStringFromFile(pathSumStateServer)
        var sum = sumStateServer.split("\n");
        var svSumMonster = Number(sum[0])
        var svSumTree = Number(sum[1])
        var svSumTower = Number(sum[2])
        var svSumBullet = Number(sum[3])
        var svEnergy = Number(sum[4])

        this.logError(sumMonster, svSumMonster, countLoop, "Monster", this.deltaMonster)
        this.logError(sumTree, svSumTree, countLoop, "Tree", this.deltaTree)
        this.logError(sumTower, svSumTower, countLoop, "Tower", this.deltaTower)
        this.logError(sumBullet, svSumBullet, countLoop, "Bullet", this.deltaBullet)
        this.logError(energy, svEnergy, countLoop, "Energy", this.deltaEnergy)

        // Round
        sumMonster = Utils.round(sumMonster).toFixed(3);
        sumTree = Utils.round(sumTree).toFixed(3);
        sumTower = Utils.round(sumTower).toFixed(3);
        sumBullet = Utils.round(sumBullet).toFixed(3);
        energy = energy;
        var contentSum = sumMonster + "\n" + sumTree + "\n" +  sumTower + "\n" + sumBullet + "\n" + energy;

        // Log state to file
        jsb.fileUtils.writeStringToFile(content, pathState);
        jsb.fileUtils.writeStringToFile(contentSum, pathSumState);
    },

    logError: function (client, server, countLoop, txt, delta) {
        if (Math.abs(client - server) > delta) {
            cc.log("\n" + txt + " - USER " + gv.user.id + " - ERROR STATE AT FRAME: " + countLoop + ", " + Math.abs(client - server) + "\n")

            switch (txt) {
                case "Monster": {
                    this.deltaMonster = delta + Math.abs(client - server)
                    break
                }
                case "Tree": {
                    this.deltaTree = delta + Math.abs(client - server)
                    break
                }
                case "Tower": {
                    this.deltaTower = delta + Math.abs(client - server)
                    break
                }
                case "Bullet": {
                    this.deltaBullet = delta + Math.abs(client - server)
                    break
                }
                case "Energy": {
                    this.deltaEnergy = delta + Math.abs(client - server)
                    break
                }
            }
        }
    }
})

var _logState;
LogState.getInstance = function () {
    if (_logState === undefined)
        _logState = new LogState();
    return _logState;
}