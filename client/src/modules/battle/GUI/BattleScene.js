var BattleScene = cc.Layer.extend({

    _cardUI: "cardUI",
    _nodeCard: "nodeCard",
    _timerBorder: "timerBorder",
    _timer: "timer",
    _nodeNext: "nodeNext",
    _progressTimer: "progressTimer",
    _txtCountDown: "txtCountDown",
    _transparentBackground: "transparentBackground",
    _btnBack : "btnBack",
    _lblOpponentRemainingHP: "lblOpponentRemainingHP",
    _lblPlayerRemainingHP: "lblPlayerRemainingHP",
    _result: "result",
    _progressCurrentEnergy: "progressCurrentEnergy",
    _lblCurrentEnergy: "lblCurrentEnergy",
    _btnSuggestionPath: "btnSuggestionPath",
    _panelText: "panelText",
    _txtPlayerHPHouse: "txtPlayerHPHouse",
    _txtSidePlayerHP: "txtSidePlayerHP",
    _txtOpponentHPHouse: "txtOpponentHPHouse",
    _txtSideOpponentHP: "txtSideOpponentHP",
    _txtCount: "txtCount",
    _panelWinOrDraw: "panelWinOrDraw",
    _panelLose: "panelLose",
    _txtOpponentName: "txtOpponentName",
    _txtNumberOfTrophy: "txtNumberOfTrophy",
    _lblPlayerTrophy: "lblPlayerTrophy",
    _lblOpponentTrophy: "lblOpponentTrophy",
    _lblTrophyResult: "lblTrophyResult",
    _lblPlayerName: "lblPlayerName",
    _lblOpponentName: "lblOpponentName",

    ctor:function (opponentName, opponentFame,
                   randomSeed,
                   listPlayerDeskCard,
                   listPlayerDeskCardLevel,
                   mapPlayer,
                   listOpponentDeskCard,
                   listOpponentDeskCardLevel,
                   mapOpponent)
    {
        this.opponentName = opponentName
        this.opponentFame = opponentFame
        this.randomSeed = randomSeed

        this.listPlayerDeskCard = listPlayerDeskCard
        this.listPlayerDeskCardLevel = listPlayerDeskCardLevel
        this.listOpponentDeskCard = listOpponentDeskCard
        this.listOpponentDeskCardLevel = listOpponentDeskCardLevel

        this.mapPlayer = mapPlayer
        this.mapOpponent = mapOpponent
        this._super()
        this.numberOfNodeCard = BATTLE.NUMBER_OF_NODE_CARD
        this.battleMgr = {}
        this.cardSelectedIndex = 0
        this.countLoopToFixDelay = 0
        gv.battleScene = this
        gv.loopMax = 0
        this.initBattleScene()
        this.addTouchListener()

        // Loop logic
        this.schedule(
            ()=>{
                this.updateLogic(Utils.round(1/BATTLE.FRAME_PER_SECOND))
            },
            Utils.round(1/BATTLE.FRAME_PER_SECOND)
        )

        // Loop UI
        this.scheduleUpdate()
    },

    initBattleScene: function (){
        // Update config
        var displaySize = cc.Director.getInstance().getVisibleSize()
        BATTLE.CONTROL_PANEL_HEIGHT = displaySize.height*BATTLE.RATIO_CONTROL_PANEL_HEIGHT_BY_HEIGHT
        BATTLE.SQUARE_SIZE = displaySize.height*BATTLE.RATIO_SQUARE_SIZE_BY_HEIGHT
        BATTLE.RIVER_HEIGHT = displaySize.height*BATTLE.RATIO_RIVER_HEIGHT_BY_HEIGHT

        // Init
        this.initSpriteSheet()
        this.initBackGround()
        this.battleMgr = new BattleMgr(
            this.randomSeed,
            this.listPlayerDeskCard,
            this.listPlayerDeskCardLevel,
            this.mapPlayer,
            this.listOpponentDeskCard,
            this.listOpponentDeskCardLevel,
            this.mapOpponent
        )
        this.addChild(this.battleMgr, 0)
        this.addTimer()
        this.addControlPanel()
        this.initNotification()
        this.addEffectBackground()
    },

    initSpriteSheet: function () {
        cc.spriteFrameCache.addSpriteFrames(res.map_ui_sprite_frames)
    },

    addEffectBackground: function () {
        let visibleSize = cc.Director.getInstance().getVisibleSize();

        // Add anh sang duoi
        var light1Animation = new sp.SkeletonAnimation(res.battle.as_duoi_json, res.battle.as_duoi_atlas)
        light1Animation.setPosition(cc.p(visibleSize.width /2, visibleSize.height /2))
        light1Animation.setAnimation(0, BATTLE.ANIMATION_NAME_OF_AS, true)
        this.addChild(light1Animation, 0)

        // Add anh sang tren
        var light2Animation = new sp.SkeletonAnimation(res.battle.as_tren_json, res.battle.as_tren_atlas)
        light2Animation.setPosition(cc.p(visibleSize.width /2, visibleSize.height /2))
        light2Animation.setAnimation(0, BATTLE.ANIMATION_NAME_OF_AS, true)
        this.addChild(light2Animation, 0)
    },

    // Kiem tra xem co nam trong vung cua timer khong
    isInTimerZone: function (touch) {
        var radius = this.timerBackground.getContentSize().width/2
        var timerCoordinate = this.timerBackground.getPosition()
        var distance = Math.sqrt((touch.x-timerCoordinate.x)*(touch.x-timerCoordinate.x) +
            (touch.y-timerCoordinate.y)*(touch.y-timerCoordinate.y))
        if (distance <= radius) {
            return true
        }
        return false
    },

    // Add timer UI
    addTimer: function () {
        let visibleSize = cc.Director.getInstance().getVisibleSize()
        this.timerBackground = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(res.battle.battle_timer_background_png))

        this.timerBackground.setPosition(visibleSize.width/2,
            visibleSize.height*BATTLE.RATIO_POSITION_TIMER_BACKGROUND_BY_HEIGHT)
        this.addChild(this.timerBackground,0, this._timer)

        var progressTimerRadial = new cc.ProgressTimer(new cc.Sprite(
            cc.spriteFrameCache.getSpriteFrame(res.battle.battle_timer_png)
        ))
        progressTimerRadial.type = cc.ProgressTimer.TYPE_RADIAL
        progressTimerRadial.reverseDir = true
        progressTimerRadial.setMidpoint(cc.p(0.5,0.5))
        progressTimerRadial.setPosition(this.timerBackground.getContentSize().width/2,this.timerBackground.getContentSize().height/2)
        this.timerBackground.addChild(progressTimerRadial, 0, this._progressTimer)

        this.timerBorder = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(res.battle.battle_timer_border_png))
        this.timerBorder.setPosition(this.timerBackground.getContentSize().width/2,this.timerBackground.getContentSize().height/2)
        this.timerBackground.addChild(this.timerBorder,0, this._timerBorder)

        var txtCountDown = new ccui.Text("", res.font.SVN_Supercell_Magic, 34)
        txtCountDown.setPosition(this.timerBackground.getContentSize().width/2,this.timerBackground.getContentSize().height/2)
        this.timerBackground.addChild(txtCountDown,0, this._txtCountDown)

        this.updateTimer()
    },

    // Show ket qua khi tran dau ket thuc
    showResult: function (resultString){
        this.unscheduleAllCallbacks()
        this.stopAllActions()
        this.runAction(
            cc.sequence(
                cc.delayTime(1),
                cc.callFunc(()=>{
                    var battleResultUI = ccs.load(res.battle_result, "").node

                    // Add transparent background
                    var transparentBackground = battleResultUI.getChildByName(this._transparentBackground).clone()
                    this.addChild(transparentBackground, 0)
                    var listener = cc.EventListener.create({
                        event: cc.EventListener.TOUCH_ONE_BY_ONE,
                        swallowTouches: true,
                        onTouchBegan: function (touch, event) {
                            return true
                        }
                    })
                    cc.eventManager.addListener(listener, transparentBackground)

                    // Add animation result
                    let visibleSize = cc.Director.getInstance().getVisibleSize()

                    var resultAnimation = new sp.SkeletonAnimation(res.battle.fx_result + resultString + BATTLE.SUFFIX_JSON,
                        res.battle.fx_result+resultString + BATTLE.SUFFIX_ATLAS)
                    resultAnimation.setPosition(cc.p(visibleSize.width / 2, visibleSize.height / 2))
                    var animationNameIdle = "fx_result_" + resultString + "_idle"
                    var animationNameInit = "fx_result_" + resultString + "_init"

                    resultAnimation.setAnimation(0, animationNameInit, false)
                    this.addChild(resultAnimation, 0)

                    // Add result UI
                    var result = battleResultUI.getChildByName(this._result).clone()
                    if (resultString == BATTLE.RESULT_LOSE_TXT) {
                        result.getChildByName(this._panelWinOrDraw).setVisible(false)
                    } else {
                        result.getChildByName(this._panelLose).setVisible(false)
                    }

                    // Set remaining HP
                    result.getChildByName(this._lblOpponentRemainingHP).setString(this.battleMgr.gameOpponentMgr.currentHP)
                    result.getChildByName(this._lblPlayerRemainingHP).setString(this.battleMgr.gamePlayerMgr.currentHP)

                    // Set name
                    var namePlayer = gv.user.name.length <= 8 ? gv.user.name : gv.user.name.slice(0, 7) + "..."
                    var nameOpponent = this.opponentName.length <= 8 ? this.opponentName : this.opponentName.slice(0, 7) + "..."
                    result.getChildByName(this._lblPlayerName).setString(namePlayer)
                    result.getChildByName(this._lblOpponentName).setString(nameOpponent)

                    // Set fame
                    result.getChildByName(this._lblPlayerTrophy).setString(gv.user.fame)
                    result.getChildByName(this._lblOpponentTrophy).setString(this.opponentFame)
                    var amountFame = gv.battle.amountFame
                    if (gv.battle.amountFame > 0) {
                        amountFame = "+" + amountFame
                    }
                    result.getChildByName(this._lblTrophyResult).setString(amountFame)
                    this.addChild(result, 0)
                    result.setVisible(false)

                    var sequence = cc.sequence(
                        cc.delayTime(2),
                        cc.callFunc(()=>{
                                resultAnimation.setAnimation(0, animationNameIdle, true)
                                result.setVisible(true)
                            }
                        )
                    )
                    resultAnimation.runAction(sequence)

                    var btnResult = result.getChildByName(this._btnBack)
                    btnResult.addClickEventListener(() => {
                        getUserController().sendGetShopInfo()
                        fr.view(Lobby);
                        return true
                    })
                })
            )
        )

    },

    initBackGround: function () {
        this.battleUI = ccs.load(res.battle_scene, "").node
        this.panelText = this.battleUI.getChildByName(this._panelText)

        this.loadOpponentName();
        this.panelText.getChildByName(this._txtNumberOfTrophy).setString(Utils.getInstance().formatIntToCurrencyString(this.opponentFame))

        this.addChild(this.battleUI, 0)
        this.addBtnSuggestionPathListener()
    },

    loadOpponentName: function () {
        var name = this.opponentName.toUpperCase()
        if (name.length > 11) {
            name = name.slice(0, 10) + "..."
        } else {
            var userNameBox = this.battleUI.getChildByName("userName").getChildByName("userNameBox")
            userNameBox.setScaleX(name.length/14)
        }
        this.panelText.getChildByName(this._txtOpponentName).setString(name)
    },

    // Khoi tao card di theo con tro khi keo tha card
    initCardDrag: function () {
        // Init container card drag
        this.cardDrag = new ccui.ImageView(res.battle.absolute_transparent_png)
        this.cardDrag.setAnchorPoint(0.5,0.5)
        this.cardDrag.setOpacity(150)
        this.cardDrag.visible = false
        this.cardDrag.setCascadeOpacityEnabled(true)
        this.addChild(this.cardDrag, 0)

        // Init range tac dung cua card khi keo
        this.radiusCard = new ccui.ImageView(res.battle.battle_tower_range_player_png)
        this.radiusCard.setPosition(this.cardDrag.getContentSize().width/2,
            this.cardDrag.getContentSize().height/2)
        this.radiusCard.visible = false
        this.cardDrag.addChild(this.radiusCard, 0)

        // Init hinh anh card khi keo
        this.cardAvatar = new ccui.ImageView(res.card.miniature[11][0])
        this.cardAvatar.setAnchorPoint(0.5, 0.3)
        this.cardAvatar.setScale(BATTLE.SQUARE_SIZE/(this.cardAvatar.getContentSize().width+10))
        this.cardAvatar.setPosition(this.cardDrag.getContentSize().width/2,
            this.cardDrag.getContentSize().height/2)
        this.cardDrag.addChild(this.cardAvatar, 0)
    },

    // Khoi tao phan thong bao khi choi
    initNotification: function () {
        var displaySize = cc.Director.getInstance().getVisibleSize()
        // Add thanh thong bao
        this.notification = new cc.Sprite(res.battle.common_notification_bar_png)
        this.notification.setScaleX(displaySize.width*1.3/this.notification.getContentSize().width)
        this.notification.setScaleY(BATTLE.SQUARE_SIZE*1.5/this.notification.getContentSize().height)
        this.notification.setPosition(displaySize.width/2, displaySize.height*0.42)
        this.notification.setVisible(false)
        this.addChild(this.notification, 0)

        // Add noi dung thong bao
        this.contentNotification = new ccui.Text("", res.font.SVN_Supercell_Magic, 16)
        this.contentNotification.setPosition(displaySize.width/2, displaySize.height*0.42)
        this.contentNotification.setVisible(false)
        this.addChild(this.contentNotification, 0)
    },

    // Hien thi trong bao la content truyen vao
    showNotification: function(errorCode) {
        // Set content
        this.contentNotification.setString(TEXT.ERROR[errorCode])
        this.notification.setVisible(true)
        this.contentNotification.setVisible(true)

        // Add effect
        this.notification.runAction(cc.sequence(cc.fadeIn(0),cc.fadeOut(3)))
        this.contentNotification.runAction(cc.sequence(cc.fadeIn(0),cc.fadeOut(3)))
    },

    addTouchListener: function () {
        this.initCardDrag()
        this.isDrag = false
        var self = this
        var distance = 0
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                distance = 0

                // Xoa UI chon muc tieu cho tru hien co
                TowerOption.getInstance().destroy();

                // Kiem tra xem co click vao card nao khong
                if (self.checkTouchCard(touch.getLocation())) {
                    self.updateTouchCard(touch.getLocation())
                    return true
                } else {
                    // Kiem tra xem co card nao dang duoc chon khong
                    if (self.cardSelectedIndex != 0) {
                        var nodeUsedCard = self.controlPanelUI.getChildByName(self._nodeCard + self.cardSelectedIndex)
                        var card = nodeUsedCard.getChildByName(self._cardUI)
                        var returnDropCardFunction = self.requestDropCard(touch.getLocation(), card)
                        if (returnDropCardFunction != gv.ERROR.SUCCESS) {
                            self.showNotification(returnDropCardFunction)
                            self.enableTouchCard()
                        }
                        return true
                    }
                }
                // Kiem tra xem co click vao vung timer khong
                if (self.isInTimerZone(touch.getLocation()) && self.battleMgr.countTurn < BATTLE.MAX_TURN) {
                    self.battleMgr.requestCreateMonsterImmediately()
                    return true
                }
                return false
            },
            onTouchMoved: function (touch, event) {
                distance += Utils.getInstance().getVectorLength(touch.getDelta())
                if (distance > 20) {
                    // Kiem tra xem co card nao dang duoc chon khong de show hieu ung
                    if (self.cardSelectedIndex != 0) {
                        self.isDrag = true
                        var nodeCard = self.controlPanelUI.getChildByName(self._nodeCard + self.cardSelectedIndex)
                        var nodeCardUI = nodeCard.getChildByName(self._cardUI)
                        self.managerDeskCard.setStatusDrag(nodeCardUI)
                        self.cardDrag.visible = true
                        self.cardDrag.x = touch.getLocation().x
                        self.cardDrag.y = touch.getLocation().y
                        switch (nodeCardUI.info.getType()) {
                            case CARD.TOWER_TYPE: {
                                self.battleMgr.gamePlayerMgr.gameGUI.onFieldGreen()

                                var radius = CardStat.getInstance().getStatTower(nodeCardUI.info.getIdInJsonFile()).range
                                    * BATTLE.SQUARE_SIZE
                                self.radiusCard.loadTexture(res.battle.battle_tower_range_player_png)
                                self.radiusCard.setScale(radius*2/self.radiusCard.getContentSize().width)
                                self.radiusCard.visible = true

                                // Fix vi tri card drag khi vao 1 o trong map
                                var coordinatePlayerInMap = self.battleMgr.gamePlayerMgr.gameGUI.getCellPositionDisplayView(touch.getLocation())
                                if (coordinatePlayerInMap.x >=0 && coordinatePlayerInMap.x < BATTLE.ROWS
                                    && coordinatePlayerInMap.y >=0 && coordinatePlayerInMap.y < BATTLE.COLUMNS) {
                                    var centralCoordinate = self.getCentralCoordinateOfPlayerCell(coordinatePlayerInMap.x, coordinatePlayerInMap.y)
                                    self.cardDrag.x = centralCoordinate.x
                                    self.cardDrag.y = centralCoordinate.y
                                }
                                break;
                            }
                            case CARD.POTION_TYPE: {
                                var card = nodeCardUI.info;
                                var statCard = CardStat.getInstance().getStatPotion(card.getIdInJsonFile(), card.level)
                                var radius = statCard.radius * BATTLE.SQUARE_SIZE
                                var mapTarget = statCard.map

                                if (mapTarget == "enemy") {
                                    self.battleMgr.gameOpponentMgr.gameGUI.onFieldGreen()
                                    self.battleMgr.gamePlayerMgr.gameGUI.onFieldRed()
                                } else if (mapTarget == "player") {
                                    self.battleMgr.gamePlayerMgr.gameGUI.onFieldGreen()
                                    self.battleMgr.gameOpponentMgr.gameGUI.onFieldRed()
                                } else {
                                    self.battleMgr.gamePlayerMgr.gameGUI.onFieldGreen()
                                    self.battleMgr.gameOpponentMgr.gameGUI.onFieldGreen()
                                }

                                self.cardAvatar.visible = false
                                self.radiusCard.loadTexture(res.battle.battle_potion_range_png)
                                self.radiusCard.setScale(radius*2/self.radiusCard.getContentSize().width)
                                self.radiusCard.visible = true
                                break;
                            }
                            case CARD.MONSTER_TYPE: {
                                self.battleMgr.gameOpponentMgr.gameGUI.onFieldGreen()
                            }
                        }
                    }
                }

            },
            onTouchEnded: function (touch, event) {
                self.cardDrag.visible = false
                self.radiusCard.visible = false
                if (self.isDrag) {
                    self.battleMgr.gamePlayerMgr.gameGUI.offFieldGreen()
                    self.battleMgr.gameOpponentMgr.gameGUI.offFieldGreen()
                    self.battleMgr.gamePlayerMgr.gameGUI.offFieldRed()
                    self.battleMgr.gameOpponentMgr.gameGUI.offFieldRed()

                    self.isDrag = false
                    var nodeUsedCard = self.controlPanelUI.getChildByName(self._nodeCard + self.cardSelectedIndex)
                    var card = nodeUsedCard.getChildByName(self._cardUI)
                    var returnDropCardFunction = self.requestDropCard(touch.getLocation(), card)
                    if (returnDropCardFunction != gv.ERROR.SUCCESS) {
                        self.showNotification(returnDropCardFunction)
                    }
                    self.enableTouchCard()
                    return true
                }
            }
        }, this)
    },

    // Tra ve tam cua toa do theo man hinh khi truyen vao toa do (hang,cot) trong map GUI cua player
    getCentralCoordinateOfPlayerCell: function (x,y) {
        var positionPlayerMapGUIX = (cc.Director.getInstance().getVisibleSize().width -
            this.battleMgr.gamePlayerMgr.gameGUI.getContentSize().width) / 2
        var positionPlayerMapGUIY = BATTLE.CONTROL_PANEL_HEIGHT
        var gameGUIHeight = BATTLE.SQUARE_SIZE * BATTLE.ROWS
        return cc.p(positionPlayerMapGUIX + y * BATTLE.SQUARE_SIZE + BATTLE.SQUARE_SIZE/2,
            positionPlayerMapGUIY + gameGUIHeight - x * BATTLE.SQUARE_SIZE -BATTLE.SQUARE_SIZE/2)
    },

    addBtnSuggestionPathListener: function () {
        var btnSuggestionPath = this.battleUI.getChildByName(this._btnSuggestionPath)
        btnSuggestionPath.addClickEventListener(()=>{
            this.battleMgr.gamePlayerMgr.showSuggestionPath()
        })
    },

    destroyCurrentSelectCard: function () {
        if (this.cardSelectedIndex != 0) {
            // Check xem du energy khong
            if (this.battleMgr.gamePlayerMgr.isEnoughEnergy(BATTLE.ENERGY_DESTROY_CARD)) {
                // Neu du energy
                var nodeCard = this.controlPanelUI.getChildByName(this._nodeCard+this.cardSelectedIndex)
                var card = nodeCard.getChildByName(this._cardUI)
                getBattleController().sendCancelCard(card.index)
                this.enableTouchCard()
            } else {
                // Neu khong du energy
                this.showNotification(gv.ERROR.CANCEL_CARD_NOT_ENOUGH_ENERGY)
                this.enableTouchCard()
            }
        }
    },

    updateDesk: function (indexCard) {
        for (var i = 1; i <= this.numberOfNodeCard; i++) {
            var nodeCard = this.controlPanelUI.getChildByName(this._nodeCard+i)
            var card = nodeCard.getChildByName(this._cardUI)
            if (card.index == indexCard) {
                this.showNextCard(i);
                break;
            }
        }
    },

    // Show card tiep theo
    showNextCard: function (indexNode) {
        var nodeNextCard = this.controlPanelUI.getChildByName(this._nodeNext)
        var nodeUsedCard = this.controlPanelUI.getChildByName(this._nodeCard + indexNode)

        var cardNodeNext = nodeNextCard.getChildByName(this._cardUI)
        var cardUsed = nodeUsedCard.getChildByName(this._cardUI)

        // Chu y getNextIndex xong moi hideCard
        // -> Tranh truong hop index vong ve dau thi hien 1 card 2 lan
        var newCard = this.managerDeskCard.getCard()

        // Bo card da dung di
        this.managerDeskCard.hideCard(cardUsed)
        cardUsed.removeFromParent()
        cardNodeNext.removeFromParent()

        // Get next card len vi tri card vua dung
        this.managerDeskCard.setNormalSize(newCard)
        this.managerDeskCard.setStatusNormal(newCard)
        nodeUsedCard.addChild(newCard, 0, this._cardUI)

        // Lay card tiep theo vao vi tri next card
        var nextCard = this.managerDeskCard.getCardForNextCardNode()
        this.managerDeskCard.setNextCardSize(nextCard)
        this.managerDeskCard.setStatusNormal(nextCard)
        nodeNextCard.addChild(nextCard, 0, this._cardUI)

        this.cardSelectedIndex = 0
    },

    enableTouchCard: function () {
        var nodeCardTouched = this.controlPanelUI.getChildByName(this._nodeCard + this.cardSelectedIndex)
        this.managerDeskCard.setStatusNormal(nodeCardTouched.getChildByName(this._cardUI))
        this.cardSelectedIndex = 0
    },

    requestDropCard: function (coordinate, card) {
        return this.battleMgr.requestDropCard(coordinate, card)
    },

    updateTouchCard: function (touch) {
        // Kiem tra xem la click vao card nao
        for (var i = 1; i <= this.numberOfNodeCard; i++) {
            var boxCard = this.controlPanelUI.getChildByName(this._nodeCard+i)
            var boxSize = boxCard.getChildByName(this._cardUI).btnCard.getContentSize()
            var btnCardPosition = boxCard.getChildByName(this._cardUI).btnCard.getPosition()
            var boxPosition = boxCard.getPosition()
            if (this.isInCardZone(touch, cc.p(boxPosition.x+btnCardPosition.x, boxPosition.y+btnCardPosition.y),
                boxSize.width, boxSize.height)) {
                // Neu card vua click dang la trang thai duoc chon roi, thi tat trang thai duoc chon di
                if (this.cardSelectedIndex == i) {
                    this.cardSelectedIndex = 0
                } else {
                    this.cardSelectedIndex = i
                }
                break
            }
        }
        // Update trang thai duoc chon cho card vua duoc click
        for (var i = 1; i <= this.numberOfNodeCard; i++) {
            var nodeCard = this.controlPanelUI.getChildByName(this._nodeCard+i)
            var nodeCardUI = nodeCard.getChildByName(this._cardUI)
            if (i == this.cardSelectedIndex){
                this.managerDeskCard.setStatusClick(nodeCardUI)
                // Update card di theo khi keo tha
                var imageCardDrag = nodeCardUI.info.getMiniature()
                this.cardAvatar.visible = true
                this.cardAvatar.loadTexture(imageCardDrag)
            } else {
                this.managerDeskCard.setStatusNormal(nodeCardUI)
            }
        }
    },

    // Check xem co click vao card nao khong
    checkTouchCard: function (touch) {
        for (var i = 1; i <= this.numberOfNodeCard; i++) {
            var boxCard = this.controlPanelUI.getChildByName(this._nodeCard+i)
            var boxSize = boxCard.getChildByName(this._cardUI).btnCard.getContentSize()
            var btnCardPosition = boxCard.getChildByName(this._cardUI).btnCard.getPosition()
            var boxPosition = boxCard.getPosition()
            if (this.isInCardZone(touch, cc.p(boxPosition.x+btnCardPosition.x, boxPosition.y+btnCardPosition.y), 
                boxSize.width, boxSize.height)) {
                return true
            }
        }
        return false
    },

    // Kiem tra xem diem touch co nam trong card khong
    isInCardZone: function (touch, cornerPoint, width, height) {
        if (touch.x >= cornerPoint.x && touch.x <=cornerPoint.x+width
            && touch.y >= cornerPoint.y && touch.y <= cornerPoint.y + height) {
            return true
        }
        return false
    },

    // Khoi tao desk card
    addDeskCard: function () {
        this.managerDeskCard = new DeskCardGUI(this.battleMgr.gamePlayerMgr.deskCardMgr)

        for (var i = 1; i <= this.numberOfNodeCard; i++) {
            var nextCard = this.managerDeskCard.getCard()
            var nodeCard = this.controlPanelUI.getChildByName(this._nodeCard+i)
            nodeCard.addChild(nextCard,0, this._cardUI)
        }
        // var nextCard = this.managerDeskCard.getCard()
        var nextCard = this.managerDeskCard.getCardForNextCardNode()
        this.managerDeskCard.setNextCardSize(nextCard)
        var nodeNextCard = this.controlPanelUI.getChildByName(this._nodeNext)
        nodeNextCard.addChild(nextCard,0, this._cardUI)
    },

    // khoi tao bang control panel
    addControlPanel: function () {
        this.controlPanelUI = ccs.load(res.control_panel, "").node
        this.addChild(this.controlPanelUI, 0)

        // Them loading bar UI
        this.loadingBar = this.controlPanelUI.getChildByName(this._progressCurrentEnergy)
        this.loadingBar.height = 26
        this.loadingBar.width = 489
        this.loadingBar.y = 24
        this.loadingBar.x = 371
        this.loadingBar.loadTexture(res.battle.progress_bar_png)
        this.loadingBar.setPercent(50)
        this.addDeskCard()
    },

    // Phan dinh thang thua de show ket qua
    checkShowResult: function () {
        switch (gv.battle.winner) {
            case -1: {
                this.showResult(BATTLE.RESULT_DRAW_TXT);
                break;
            }
            case 0: {
                this.showResult(BATTLE.RESULT_LOSE_TXT)
                break;
            }
            case 1: {
                this.showResult(BATTLE.RESULT_WIN_TXT)
                break;
            }
        }
    },

    // Update phan HP hien thi tren UI
    updateCurrentHP: function () {
        var txtPlayerHPHouse = this.panelText.getChildByName(this._txtPlayerHPHouse)
        var txtSidePlayerHP = this.panelText.getChildByName(this._txtSidePlayerHP)
        txtPlayerHPHouse.setString(this.battleMgr.gamePlayerMgr.currentHP)
        txtSidePlayerHP.setString(this.battleMgr.gamePlayerMgr.currentHP)

        var txtOpponentHPHouse = this.panelText.getChildByName(this._txtOpponentHPHouse)
        var txtSideOpponentHP = this.panelText.getChildByName(this._txtSideOpponentHP)
        txtOpponentHPHouse.setString(this.battleMgr.gameOpponentMgr.currentHP)
        txtSideOpponentHP.setString(this.battleMgr.gameOpponentMgr.currentHP)
    },

    // Update UI turn
    updateCountTurn: function (){
        var txtCount = this.panelText.getChildByName(this._txtCount)
        if (this.battleMgr.countTurn <= BATTLE.MAX_TURN) {
            txtCount.setString(this.battleMgr.countTurn + "/" + BATTLE.MAX_TURN)
        }
    },

    // Update UI timer
    updateTimer: function () {
        var timer = this.getChildByName(this._timer)
        var progressTimer = timer.getChildByName(this._progressTimer)
        var txtCountDown = timer.getChildByName(this._txtCountDown)

        txtCountDown.setString(Math.floor(this.battleMgr.timer))
        progressTimer.setPercentage(this.battleMgr.timer/BATTLE.INIT_TIME_COUNT_DOWN*100)

        if (this.battleMgr.gamePlayerMgr.listLogicMonster.length == 0
            && this.battleMgr.countTurn < BATTLE.MAX_TURN
            && this.battleMgr.listPreMonsterPlayer.length == 0) {
            this.timerBorder.visible = true
        } else {
            this.timerBorder.visible = false
        }
    },

    // Update UI energy
    updateCurrentEnergy: function (){
        this.loadingBar.setPercent(this.battleMgr.gamePlayerMgr.currentEnergy*100/BATTLE.MAX_ENERGY)
        this.controlPanelUI.getChildByName(this._lblCurrentEnergy).setString(this.battleMgr.gamePlayerMgr.currentEnergy)
    },

    updateLogic: function (dt) {
        this.countLoopToFixDelay++;
        this.handleDelay(dt)
        if (this.battleMgr.countLoop === gv.battle.frameEnd) {
            this.checkShowResult()
            cc.log(this.battleMgr.countLoop)
            cc.log(this.battleMgr.gamePlayerMgr.currentHP)
        }
        if (this.battleMgr.countLoop < gv.loopMax) {
            this.battleMgr.updateLogic(dt)
            this.updateCurrentHP()
            this.updateCurrentEnergy()
            this.updateCountTurn()
            this.updateTimer()
        }
    },

    // Update list object UI
    update: function (dt) {
        this.battleMgr.updateUI(dt)
    },

    handleDelay: function (dt) {
        var currentDelay = gv.loopMax - this.battleMgr.countLoop - BATTLE.FRAME_PERIOD

        if (currentDelay > BATTLE.MAX_DELAY) {
            for (var i = 0; i < currentDelay - BATTLE.MAX_DELAY; i++) {
                this.battleMgr.updateLogic(dt)
            }
        }

        if (this.countLoopToFixDelay === BATTLE.PERIOD_TO_FIX_DELAY) {
            this.countLoopToFixDelay = 0;
            if (gv.loopMax - this.battleMgr.countLoop - BATTLE.FRAME_PERIOD > 0) {
                this.battleMgr.updateLogic(dt)
            }
        }
    }
})

