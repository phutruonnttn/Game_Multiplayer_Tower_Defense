/**
 * Created by Team 2 - LongLH - GDF 17 on 8/11/2022.
 */


var LobbyNavigationBar = cc.Class.extend({

    _imgIcon: "imgIcon",
    _txtLabel: "txtLabel",

    ctor: function (layoutNavigationBar, pageView) {
        this.layoutNavigationBar = layoutNavigationBar;
        this.pageView = pageView;
        this.initLobbyNavigationBar();
    },

    initLobbyNavigationBar: function () {
        this.initButtonList();
        this.curPage = this.pageView.getCurPageIndex();
        this.gotoPage(gv.LOBBY.DEFAULT_PAGE);
    },

    setBtnTexture: function (button, texture) {
        button.loadTextureNormal(texture);
        button.loadTexturePressed(texture);
    },

    initButtonList: function () {
        this.listBtn = this.layoutNavigationBar.getChildren();
        for (let idx in this.listBtn) {
            this.listBtn[idx].addClickEventListener(this.gotoPage.bind(this, Number(idx)));
            this.setBtnTexture(this.listBtn[idx], res.naviagtion_bar.img_btn_normal[Number(idx)%res.naviagtion_bar.img_btn_normal.length]);
        }
    },

    gotoPage: function (pageId) {
        this.pageView.scrollToPage(pageId);
        this.updateUI();
    },

    swapUI: function (pageSelect, pageDeselect) {
        let btnSelected = this.listBtn[pageSelect];
        let btnDeselect = this.listBtn[pageDeselect];

        let imgIconSelected = btnSelected.getChildByName(this._imgIcon);
        let imgIconDeselect = btnDeselect.getChildByName(this._imgIcon);
        let dyImgIcon = imgIconDeselect.y - imgIconSelected.y;
        imgIconDeselect.runAction(cc.MoveBy.create(gv.LOBBY.NAVIGATION_BAR.MOVE_UP_DURATION,  cc.p(0, -dyImgIcon)));
        imgIconSelected.runAction(cc.MoveBy.create(gv.LOBBY.NAVIGATION_BAR.MOVE_UP_DURATION,  cc.p(0, dyImgIcon)));
    },

    updatePos: function () {
        let posX = 0;
        for (let idx in this.listBtn) {
            if (Number(idx) === this.curPage) {
                this.listBtn[idx].getChildByName(this._txtLabel).setVisible(true);
                this.setBtnTexture(this.listBtn[idx],res.naviagtion_bar.img_btn_selecting);
            }
            else {
                this.listBtn[idx].getChildByName(this._txtLabel).setVisible(false);
                this.setBtnTexture(this.listBtn[idx], res.naviagtion_bar.img_btn_normal[Number(idx) % res.naviagtion_bar.img_btn_normal.length]);
            }
            this.listBtn[idx].setPositionX(posX);
            posX += this.listBtn[idx].width;
            this.listBtn[idx].getChildByName(this._imgIcon).setPositionX(this.listBtn[idx].width/2);
            this.listBtn[idx].getChildByName(this._txtLabel).setPositionX(this.listBtn[idx].width/2);
        }
    },

    updateUI: function () {
        if (this.curPage === this.pageView.getCurPageIndex())
            return;
        this.swapUI(this.pageView.getCurPageIndex(), this.curPage);
        this.curPage = this.pageView.getCurPageIndex();
        this.updatePos();
    }

});