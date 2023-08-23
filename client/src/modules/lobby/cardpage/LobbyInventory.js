/**
 * Created by Team 2 - LongLH - GDF 17 on 7/11/2022.
 */


var LobbyInventory = cc.Class.extend({

    _nodeStartRow: "nodeStartRow",
    _nodeOx: "nodeOx",
    _nodeEndRow: "nodeEndRow",
    _nodeOy: "nodeOy",

    ctor: function (layoutInventory) {
        this.layoutInventory = layoutInventory;
        this.initLobbyInventory();
    },

    initLobbyInventory: function () {
        let nodeStartRow = this.layoutInventory.getChildByName(this._nodeStartRow);
        let nodeOx = this.layoutInventory.getChildByName(this._nodeOx);
        let nodeEndRow = this.layoutInventory.getChildByName(this._nodeEndRow);
        let nodeOy = this.layoutInventory.getChildByName(this._nodeOy);
        this.dx = nodeOx.x - nodeStartRow.x;
        this.dy = nodeOy.y - nodeStartRow.y;
        this.nCol = Math.ceil((nodeEndRow.x - nodeStartRow.x) / this.dx);
        this.posCorner = nodeStartRow.getPosition();
    },

    getPositionByIndex: function (index) {
        index = Number(index);
        let y = this.posCorner.y + this.dy * Math.floor(index / this.nCol);
        let x = this.posCorner.x + this.dx * (index % this.nCol);
        return cc.p(x,y);
    },

    updateUI: function () {
        if (this.lobbyInventoryCardItem !== undefined)
            for (let idx in this.lobbyInventoryCardItem) {
                this.lobbyInventoryCardItem[idx].updateUI();
                this.lobbyInventoryCardItem[idx].setPosition(this.getPositionByIndex(idx));
            }
    }

});