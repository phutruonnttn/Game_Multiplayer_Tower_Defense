let LogicHole = cc.Sprite.extend({

    ctor: function (typeOfObstacle) {
        this.currentHP = ObstacleType[typeOfObstacle].healthPoint
    },

    initPosition: function (x, y) {
        this.x = x
        this.y = y
    },
})
