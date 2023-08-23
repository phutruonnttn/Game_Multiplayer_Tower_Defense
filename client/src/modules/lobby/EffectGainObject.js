var EffectGainObject = cc.Class.extend({

    // ctor: function (object, numberOfObject, coordinateFrom, coordinateTo, parentGUI, tag, callback) {
    ctor: function (object, numberOfObject, coordinateFrom, coordinateTo, parentGUI, callback) {
        this.object = object
        this.numberOfObject = numberOfObject
        this.coordinateFrom = coordinateFrom
        this.coordinateTo = coordinateTo
        this.parentGUI = parentGUI
        // this.tag = tag
        this.callback = callback;

        this.init()
        this.move()
    },

    init: function () {
        // while (this.parentGUI.getChildByName(this.tag)) {
        //     this.parentGUI.removeChildByName(this.tag, true)
        // }
        this.listObject = []
        for (var i = 0; i < this.numberOfObject; i++) {
            this.listObject[i] = this.object.clone()
            this.listObject[i].setPosition(this.coordinateFrom)
            // this.parentGUI.addChild(this.listObject[i], 0, this.tag)
            this.parentGUI.addChild(this.listObject[i])
        }
    },

    move: function () {
        for (var i = 0; i < this.numberOfObject; i++) {
            var newPosX, newPosY
            if (Math.round(Math.random()) === 0) {
                newPosX = this.coordinateFrom.x + Math.random()*(cc.winSize.width/7)
            } else {
                newPosX = this.coordinateFrom.x - Math.random()*(cc.winSize.width/7)
            }
            if (Math.round(Math.random()) === 0) {
                newPosY = this.coordinateFrom.y + Math.random()*(cc.winSize.width/7)
            } else {
                newPosY = this.coordinateFrom.y - Math.random()*(cc.winSize.width/7)
            }

            this.listObject[i].runAction(cc.sequence(
                cc.moveTo(0.5, newPosX, newPosY),
                cc.delayTime(0.5+Math.random()*0.5),
                cc.spawn(
                    cc.moveTo(0.5,this.coordinateTo),
                    cc.scaleTo(0.5, 0)
                ),
                cc.callFunc(
                    (object) => {
                        object.removeFromParent(true);
                    },
                    null, this.listObject[i]
                ),
                cc.callFunc(() => {
                    if (typeof this.callback === "function")
                        this.callback();
                })
            ))
        }
    }
})