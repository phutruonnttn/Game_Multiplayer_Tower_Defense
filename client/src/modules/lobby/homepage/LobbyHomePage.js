/**
 * Created by Team 2 - LongLH - GDF 17 on 3/11/2022.
 */


var LobbyHomePage = cc.Class.extend({

    _btnFindMatch: "btnFindMatch",
    _layoutPlayerInfo: "layoutPlayerInfo",
    _sprAvatar: "sprAvatar",
    _txtName: "txtName",
    _txtFame: "txtFame",
    _sprFameIcon: "sprFameIcon",
    _layoutChests: "layoutChests",
    _btnCheatChest: "btnCheatChest",

    ctor: function (layoutHomePage) {
        this.layoutHomePage = layoutHomePage;
        this.initLobbyHomePage();
    },

    initLobbyHomePage: function () {
        this.initBtnFindMatch();
        this.initLayoutPlayerInfo();
        this.initLayoutChests();
        this.initBtnCheatChest();
        this.runGainChestAnimation();
        this.runTrophyAnimation();
    },

    initBtnFindMatch: function () {
        this.btnFindMatch = this.layoutHomePage.getChildByName(this._btnFindMatch);
        this.btnFindMatch.addClickEventListener(this.findMatch.bind(this));
    },

    initLayoutPlayerInfo: function () {
        let layoutPlayerInfo = this.layoutHomePage.getChildByName(this._layoutPlayerInfo);

        this.sprAvartar = layoutPlayerInfo.getChildByName(this._sprAvatar);
        this.txtPlayerName = layoutPlayerInfo.getChildByName(this._txtName);
        this.txtFame = layoutPlayerInfo.getChildByName(this._txtFame);
        this.txtFame.setString(Utils.getInstance().formatIntToCurrencyString(gv.user.fame));

        this.updatePlayerInfo();
    },

    initLayoutChests: function () {
        this.lobbyHomeListChest = new LobbyHomeListChest(this.layoutHomePage.getChildByName(this._layoutChests));
    },

    initBtnCheatChest: function () {
        let btnCheatChest = this.layoutHomePage.getChildByName(this._btnCheatChest);
        btnCheatChest.addClickEventListener(function () {
            getUserController().sendCheatChest();
        });
    },

    updatePlayerInfo: function () {
        this.updateAvatar();
        this.updateName();
    },

    updateAvatar: function () {
        this.sprAvartar.setTexture(gv.user.avatar);
    },

    updateName: function () {
        this.txtPlayerName.setString(gv.user.name);
    },

    updateFame: function (deltaFame) {
        EffectLobby.changeNumberLabel(this.txtFame, deltaFame, 0.5);
    },

    runGainChestAnimation: function () {
        // Animation bay chest xuống
        if (gv.battle !== undefined && gv.battle.winner === BATTLE.RESULT_WIN && gv.user.getEmptyChestSlot() >= 0) {
            gv.battle.winner = undefined;
            EffectLobby.gainObject(
                new ccui.ImageView("lobby/treasure/common_treasure_tutorial.png"),
                1,
                cc.p(cc.winSize.width/2,cc.winSize.height/2),
                cc.p(
                    cc.winSize.width / 4 * (Number(gv.user.getEmptyChestSlot()) + 0.5),
                    this.layoutHomePage.getChildByName(this._layoutChests).getPosition().y
                ),
                this.layoutHomePage,
                function () {
                    gv.user.setChest(gv.user.getEmptyChestSlot(), new Chest(gv.user.getEmptyChestSlot()));
                }
            )
        }
    },

    runTrophyAnimation: function () {
        // Animation bay trophy lên hoặc xuống
        if (gv.battle !== undefined && gv.battle.amountFame !== undefined) {
            let deltaFame = gv.battle.amountFame;
            gv.battle.amountFame = undefined;
            gv.user.fame += deltaFame;
            let trophy = new ccui.ImageView("common/common_icon_trophy.png");
            trophy.setScale(0.42);
            if (deltaFame > 0) {
                EffectLobby.gainObject(
                    trophy,
                    deltaFame,
                    cc.p(cc.winSize.width / 2, cc.winSize.height / 2),
                    this.layoutHomePage.getChildByName(this._sprFameIcon).getPosition(),
                    this.layoutHomePage,
                    function () {
                        EffectLobby.changeNumberLabel(this.txtFame, 1, 1);
                    }.bind(this)
                )
            } else {
                EffectLobby.gainObject(
                    trophy,
                    -deltaFame,
                    this.layoutHomePage.getChildByName(this._sprFameIcon).getPosition(),
                    cc.p(cc.winSize.width / 2, cc.winSize.height / 2),
                    this.layoutHomePage,
                    function () {
                        EffectLobby.changeNumberLabel(this.txtFame, -1, 1);
                    }.bind(this)
                )
            }
        }
    },

    findMatch: function (event, customEventData) {
        cc.log("---- Find Match ----");
        gv.lobby.lobbyShopPage.clearCountDown()
        fr.view(FindMatchUI, 1);
    },

});