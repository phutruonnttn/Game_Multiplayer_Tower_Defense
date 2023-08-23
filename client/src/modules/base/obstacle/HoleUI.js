let HoleUI = cc.Sprite.extend({

    ctor: function (typeOfObstacle, position, logicHole) {

        this._super(cc.spriteFrameCache.getSpriteFrame("map_forest_obstacle_"
            + typeOfObstacle + BATTLE.SUFFIX_PNG))

        this.setScaleX(BATTLE.SQUARE_SIZE / (this.getContentSize().width*5/4))
        this.setScaleY(BATTLE.SQUARE_SIZE / (this.getContentSize().height))
        if (typeOfObstacle == BATTLE.HOLE_TYPE) {
            this.setAnchorPoint(0.5,0.5)
        } else {
            this.setAnchorPoint(0.5,0.2)
        }
        this.setPosition(position)
    },
})
