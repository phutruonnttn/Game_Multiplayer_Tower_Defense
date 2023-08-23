var ActionBattle = cc.Class.extend({

    ctor: function (userID, cmdID, errorCode, frameRunAction) {
        this.userID = userID
        this.cmdID = cmdID
        this.errorCode = errorCode
        this.frameRunAction = frameRunAction

        this.indexCard = -1
        this.coordinateX = -1
        this.coordinateY = -1
        this.map = -1
    }
})