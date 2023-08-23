/**
 * Created by KienVN on 7/15/2016.
 */

db.BlendMode =
{
    BM_NORMAL:0,
    BM_ADD:1,
    BM_ALPHA:2,
    BM_DARKEN:3,
    BM_DIFFERENCE:4,
    BM_ERASE:5,
    BM_HARDLIGHT:6,
    BM_INVERT:7,
    BM_LAYER:8,
    BM_LIGHTEN:9,
    BM_MULTIPLY:10,
    BM_OVERLAY:11,
    BM_SCREEN:12,
    BM_SUBTRACT:14};

var db;
(function (db) {
    var DBCCSlot = (function (_super) {
        __extends(DBCCSlot, _super);
        function DBCCSlot() {
            _super.call(this);
        }
        DBCCSlot.toString = function () {
            return "[Class db.DBCCSlot]";
        };
        DBCCSlot.prototype.getVisible = function () {
            return this._display ? this._display.visible : false;
        };
        DBCCSlot.prototype.setVisible = function (value) {
            if (this._display) {
                this._display.visible = value;
            }
        };
        DBCCSlot.prototype.getDisplay = function () {
            return this._display;
        };
        DBCCSlot.prototype.getCCDisplay = DBCCSlot.prototype.getDisplay;
        DBCCSlot.prototype.setDisplay = function (value) {
            if (this._display == value) {
                return;
            }
            if (this._display) {
                var parent = this._display.getParent();
                // if (parent) {
                //    var children = parent.getChildren();
                //  var index = children.getLocalZOrder();
                // }
                this.removeDisplay();
            }
            this._display = value;
            this.addDisplay(parent, this.getZOrder());
        };
        DBCCSlot.prototype.setDisplayImage = DBCCSlot.prototype.setDisplay;
        DBCCSlot.prototype.dispose = function () {
            this._display = null;
        };
        DBCCSlot.prototype.updateTransform = function (matrix, transform) {
            this._display.setPositionX(matrix.tx);
            this._display.setPositionY(-matrix.ty);
            this._display.setRotationX(transform.skewX * DBCCSlot.RADIAN_TO_ANGLE);
            this._display.setRotationY(transform.skewY * DBCCSlot.RADIAN_TO_ANGLE);
            //TODO - skew?
            // this._display.setSkewX(transform.skewX * Cocos2DDisplayBridge.RADIAN_TO_ANGLE);
            //this._display.setSkewY(transform.skewY * Cocos2DDisplayBridge.RADIAN_TO_ANGLE);
            this._display.setScaleX(transform.scaleX);
            this._display.setScaleY(transform.scaleY);
        };

        DBCCSlot.prototype.updateColor = function (aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier) {
            if (this._display) {
                this._display.setOpacity(aMultiplier * 255);
            }
        };

        DBCCSlot.prototype.addDisplay = function (container, index) {
            var parent = container;
            if (parent && this._display) {
                this._display.removeFromParent();
                if (index < 0) {
                    parent.addChild(this._display, parent.getChildrenCount()+1);
                } else {
                    parent.addChild(this._display, index);
                }
            }
        };

        DBCCSlot.prototype.removeDisplay = function () {
            if (this._display && this._display.getParent()) {
                this._display.getParent().removeChild(this._display, true);
            }
        };
        DBCCSlot.prototype.updateBlendMode = function(blendMode)
        {
            if(!this._display || !this._display.getTexture)
            {
                return;
            }
            if(blendMode == "normal")
            {

            }else if (blendMode == "add")
            {
                var texture = this._display.getTexture();
                if (texture && texture.hasPremultipliedAlpha())
                {
                    this._display.setBlendFunc(new cc.BlendFunc(cc.ONE,cc.ONE));
                }else
                {
                    this._display.setBlendFunc(new cc.BlendFunc(cc.SRC_ALPHA, cc.ONE));
                }
            }
        };
        DBCCSlot.RADIAN_TO_ANGLE = 180 / Math.PI;
        return DBCCSlot;
    }(dragonBones.Slot));
    db.DBCCSlot = DBCCSlot;
})(db || (db = {}));