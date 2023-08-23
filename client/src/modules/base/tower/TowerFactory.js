/**
 * Created by Team 2 - LongLH - GDF 17 on 6/11/2022.
 */


var TowerFactory = {};

TowerFactory.create = function(card, gameMgr, pos) {
    let towerID = card.getIdInJsonFile();
    if (towerID in TowerFactory.CLASS) {
        let towerLogic = new TowerFactory.CLASS[towerID].LOGIC(card, gameMgr);
        towerLogic.setPosition(pos);
        let towerUI = new TowerFactory.CLASS[towerID].UI(gameMgr);
        towerUI.setLogic(towerLogic);
        return {
            logic: towerLogic,
            ui: towerUI,
        }
    }
    else {
        return TowerFactory.create(gv.user.listCard[11], gameMgr, pos);
    }
}

TowerFactory.CLASS = TowerFactory.CLASS || {};
TowerFactory.CLASS[TOWER.ID.OLW] = {
    LOGIC: TowerLogicOlw,
    UI: TowerUIOlw,
};
TowerFactory.CLASS[TOWER.ID.CROW] = {
    LOGIC: TowerLogicCrow,
    UI: TowerUICrow,
};
TowerFactory.CLASS[TOWER.ID.FROG] = {
    LOGIC: TowerLogicFrog,
    UI: TowerUIFrog,
};
TowerFactory.CLASS[TOWER.ID.BUNNY] = {
    LOGIC: TowerLogicBunny,
    UI: TowerUIBunny,
};
TowerFactory.CLASS[TOWER.ID.BEAR] = {
    LOGIC: TowerLogicBear,
    UI: TowerUIBear,
};
TowerFactory.CLASS[TOWER.ID.SNAKE] = {
    LOGIC: TowerLogicSnake,
    UI: TowerUISnake,
};
TowerFactory.CLASS[TOWER.ID.GOAT] = {
    LOGIC: TowerLogicGoat,
    UI: TowerUIGoat,
};