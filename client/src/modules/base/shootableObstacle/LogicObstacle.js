let LogicObstacle = ShootableObject.extend({

    ctor: function (typeOfObstacle, id) {
        this._super(id);
        this.currentHP = ObstacleType[typeOfObstacle].healthPoint
    },

    initPosition: function (x, y) {
        this.position = cc.p(x, y);
    },

    setUI: function (obstacleUI) {
        this.obstacleUI = obstacleUI;
    },

})