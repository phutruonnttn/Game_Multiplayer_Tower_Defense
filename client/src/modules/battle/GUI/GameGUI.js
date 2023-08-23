let GameGUI = cc.Layer.extend({

    _houseAttacked: "houseAttacked",
    _txtAmount: "txtAmount",

    ctor: function (logicMap, isPlayerMap){
        this._super()

        // Rotation if this is Opponent's MAP
        this.isPlayerMap = isPlayerMap;
        if (this.isPlayerMap === false) {
            this.setRotation(180);
        }

        this.logicMap = logicMap
        this.squareSize = BATTLE.SQUARE_SIZE
        this.width = Utils.round(this.squareSize * BATTLE.COLUMNS);
        this.height = Utils.round(this.squareSize * BATTLE.ROWS);
        this.setContentSize(this.width, this.height)
        this.listBuff = []
        this.mapHouse = {}
        this.effectDecreaseHP = null
        this.showMap()
        this.initField()
    },

    initField: function () {
        // Field green
        this.fieldGreen = fr.createAtlasAnimation(resAni.enemy_circle)
        this.fieldGreen.setAnimation(0, resAniId.enemy_circle.field_green, true);
        this.addChild(this.fieldGreen)
        this.fieldGreen.setPosition(cc.p(this.getContentSize().width/2,this.getContentSize().height/2))
        this.fieldGreen.setVisible(false)

        // Field red
        this.fieldRed = fr.createAtlasAnimation(resAni.enemy_circle)
        this.fieldRed.setAnimation(0, resAniId.enemy_circle.field_red, true);
        this.addChild(this.fieldRed)
        this.fieldRed.setPosition(cc.p(this.getContentSize().width/2,this.getContentSize().height/2))
        this.fieldRed.setVisible(false)
    },

    onFieldGreen: function () {
        this.fieldGreen.setVisible(true)
    },

    offFieldGreen: function () {
        this.fieldGreen.setVisible(false)
    },

    onFieldRed: function () {
        this.fieldRed.setVisible(true)
    },

    offFieldRed: function () {
        this.fieldRed.setVisible(false)
    },

    // Add child and AUTO ROTATION 180 DEGREE if this is Opponent's MAP
    addChild: function (child, localZOrder, tag) {
        localZOrder = localZOrder === undefined ? child.getLocalZOrder() : localZOrder;
        localZOrder = localZOrder === undefined ? 0 : localZOrder;
        tag = tag === undefined ? "" : tag;
        this._super(child, localZOrder, tag);
        if (this.isPlayerMap === false)
            child.setRotation(180);
    },

    // Tra ve toa do o khi truyen vao touch theo toa do man hinh
    getCellPositionDisplayView: function (coordinates) {
        var px = BATTLE.ROWS - (Math.floor((coordinates.y-this.getPositionY())/this.squareSize)+1)
        var py = Math.floor((coordinates.x-this.getPositionX())/this.squareSize)
        return cc.p(px,py)
    },

    // Tra ve toa do tren map khi truyen vao touch theo toa do man hinh
    getCoordinateMapDisplayView: function (coordinates) {
        var x = coordinates.x - this.getPositionX()
        var y = coordinates.y - this.getPositionY()
        return cc.p(x,y)
    },

    // Tra ve toa do o khi truyen vao touch theo toa do tren map
    getCellPositionGameGUI: function (coordinates) {
        var px = Math.floor((this.height - coordinates.y) / this.squareSize)
        var py = Math.floor(coordinates.x / this.squareSize)
        return cc.p(px,py)
    },

    showMap: function (){
        this.addGrid()
    },

    // Hien thi hieu ung giam mau
    showEffectDecreaseHP: function () {
        if (!this.isPlayerMap) {
            return
        }

        if (this.effectDecreaseHP == null) {
            this.effectDecreaseHP = fr.createAtlasAnimation(resAni.enemy_circle)
            this.effectDecreaseHP.setAnimation(0, resAniId.enemy_circle.tower_get_hit_fx, false);
            this.addChild(this.effectDecreaseHP)
            this.effectDecreaseHP.setPosition(cc.p(this.getContentSize().width/2,this.getContentSize().height/2 + BATTLE.CONTROL_PANEL_HEIGHT + BATTLE.SQUARE_SIZE/3))
            this.effectDecreaseHP.runAction(
                cc.fadeOut(0.3)
            )
        } else {
            this.effectDecreaseHP.stopAllActions()
            this.effectDecreaseHP.setOpacity(255)
            this.effectDecreaseHP.runAction(cc.show())
            this.effectDecreaseHP.setAnimation(0, resAniId.enemy_circle.tower_get_hit_fx, false);
            this.effectDecreaseHP.runAction(
                cc.fadeOut(0.3)
            )
        }
    },

    addBuffGrid: function (position, type) {
        this.listBuff.push({
            "position": position,
            "type": type
        })
        var grid = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(res.battle.battle_item + BATTLE.LIST_BUFF[type].name + "_2.png"))
        grid.setScaleX(this.squareSize / grid.getContentSize().width)
        grid.setScaleY(this.squareSize / grid.getContentSize().height)
        grid.setAnchorPoint(0.5,0.5)
        grid.setPosition(position)
        this.addChild(grid,-1)
    },

    // Them o buff
    addGrid: function (){
        for (var i = 0; i < BATTLE.ROWS; i++) {
            for (var j = 0; j < BATTLE.COLUMNS; j++) {
                if (this.logicMap.getBuffOfCell(i,j) != BATTLE.NO_BUFF) {
                    this.addBuffGrid(this.positionOf(i, j), this.logicMap.getBuffOfCell(i, j))
                }
            }
        }
    },

    // Truyen vao vi tri (row,column) tren map -> trả về điểm chính giữa bằng toa do vi tri (x,y) tren map
    positionOf: function (row, column){
        return cc.p(
            Utils.round(column * this.squareSize + this.squareSize/2),
            Utils.round(this.height - row *this.squareSize -this.squareSize/2)
        );
    },

    getNextPointOfPath: function (previousPoint, x, y) {
        return this.logicMap.getNextPointOfPath(previousPoint, x, y)
    },

    showPath: function (x,y) {
        // Delete previous path
        while (this.getChildByName(BATTLE.FLAG_SHOW_PATH) != null) {
            this.removeChildByName(BATTLE.FLAG_SHOW_PATH)
        }
        // Show path
        var previous = cc.p(x,y)
        do {
            var transparentSquare = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(res.battle.transparent_square_png))
            transparentSquare.setScaleX(this.squareSize / (transparentSquare.getContentSize().width+1))
            transparentSquare.setScaleY(this.squareSize / (transparentSquare.getContentSize().height))
            var position = this.positionOf(x, y)
            transparentSquare.setPosition(position)
            this.addChild(transparentSquare,-1,BATTLE.FLAG_SHOW_PATH)
            var nextPoint = this.getNextPointOfPath(previous, x,y)
            previous = cc.p(x,y)
            x = nextPoint.x
            y = nextPoint.y
        } while (x!=BATTLE.TARGET_POINT.x || y!=BATTLE.TARGET_POINT.y)
    },

    // Setup huong cua mui ten
    setDirectionArrow: function (arrow, currentPoint, nextPoint) {
        var vector = Utils.getInstance().getVector(currentPoint, nextPoint)
        var vectorNormalize = Utils.getInstance().normalizeVector(vector)
        var direction = BATTLE.MAP_DIRECTION_TOP_LEFT_ORIGIN[vectorNormalize.x+1][vectorNormalize.y+1]
        switch (direction) {
            case BATTLE.TOP:
                arrow.setRotation(-90)
                break
            case BATTLE.RIGHT:
                break
            case BATTLE.LEFT:
                arrow.setFlippedX(true)
                break
            case BATTLE.BOTTOM:
                arrow.setRotation(90)
                break
        }
    },

    showSuggestionPath: function (trace) {
        // Delete previous path
        while (this.getChildByName(BATTLE.FLAG_SUGGESTION_PATH) != null) {
            this.removeChildByName(BATTLE.FLAG_SUGGESTION_PATH)
        }

        // Them diem xuat phat
        var tmpTrace = trace.slice()
        tmpTrace.push(cc.p(-1,0))
        tmpTrace.push(cc.p(-1,1))

        // Show path
        var delayTime = 0.5
        for (var i = tmpTrace.length-2; i>=0; i--) {
            var arrow = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(res.battle.icon_arrow_png))
            arrow.setScale(this.squareSize*0.5 / (arrow.getContentSize().width))
            this.setDirectionArrow(arrow, tmpTrace[i+1], tmpTrace[i])
            arrow.setPosition(this.positionOf(tmpTrace[i].x, tmpTrace[i].y))
            arrow.setOpacity(0)
            this.addChild(arrow,0, BATTLE.FLAG_SUGGESTION_PATH)
            var sequence = cc.sequence(cc.delayTime(delayTime), cc.fadeIn(0), cc.fadeOut(2))
            delayTime += 0.1
            arrow.runAction(sequence)
        }
    },

    showEffectHouseAttacked: function (amount) {
        // Get random position
        var randomX = Math.random()*BATTLE.SQUARE_SIZE/4
        var randomY = Math.random()*BATTLE.SQUARE_SIZE/2

        // Load effect image
        var houseAttackedEffect = ccs.load(res.house_attacked, "").node.getChildByName(this._houseAttacked).clone()
        var txtAmount = houseAttackedEffect.getChildByName(this._txtAmount)
        txtAmount.setString(amount)
        var position = this.positionOf(BATTLE.TARGET_POINT.x, BATTLE.TARGET_POINT.y)

        if (this.isPlayerMap) {
            houseAttackedEffect.setPosition(position.x - BATTLE.SQUARE_SIZE / 2 + randomX, position.y + randomY)
        } else {
            houseAttackedEffect.setPosition(position.x + BATTLE.SQUARE_SIZE / 2 - randomX, position.y - randomY)
        }
        this.addChild(houseAttackedEffect)

        // Add effect
        var timeMoveBy = 1
        var timeFadeOut = 2

        var moveBy
        if (this.isPlayerMap) {
            moveBy = cc.moveBy(timeMoveBy, 0, BATTLE.SQUARE_SIZE/2)
        } else {
            moveBy = cc.moveBy(timeMoveBy, 0, -BATTLE.SQUARE_SIZE/2)
        }
        var remove = cc.callFunc( () =>{
            this.removeChild(houseAttackedEffect)
        })
        houseAttackedEffect.setCascadeColorEnabled(true)
        houseAttackedEffect.setCascadeOpacityEnabled(true)
        houseAttackedEffect.runAction(cc.sequence(moveBy, cc.fadeOut(timeFadeOut), remove))
    }
})