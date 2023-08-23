var MapBattle = cc.Class.extend({
    ctor: function (arrPositionBuff, arrPositionTree, positionHole, arrVirtualPath) {
        this.arrPositionBuff = [...arrPositionBuff]
        this.arrPositionTree = [...arrPositionTree]
        this.positionHole = positionHole
        this.arrVirtualPath = [...arrVirtualPath]
    }
})