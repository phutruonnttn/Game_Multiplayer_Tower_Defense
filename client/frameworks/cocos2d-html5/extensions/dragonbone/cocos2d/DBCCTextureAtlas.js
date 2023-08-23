/**
 * Created by KienVN on 7/20/2016.
 */
/**
 * Created by KienVN on 7/15/2016.
 */
var db;
(function (db) {
    var DBCCTextureAtlas = (function () {
        function DBCCTextureAtlas(image, textureAtlasData, scale) {
            if (typeof scale === "undefined") { scale = 1; }
            this._regions = {};

            this.image = image;
            this.scale = scale;

            this.parseData(textureAtlasData);
        }
        DBCCTextureAtlas.prototype.dispose = function () {
            this.image = null;
            this._regions = null;
        };

        DBCCTextureAtlas.prototype.getRegion = function (subTextureName) {
            return this._regions[subTextureName];
        };

        DBCCTextureAtlas.prototype.parseData = function (textureAtlasData) {
            this.name = textureAtlasData.__name;
            delete textureAtlasData.__name;
            var subTextureData;
            var rect;
            var spriteFrame;
            for (var subTextureName in textureAtlasData) {
                //for example - {"name":"parts/clothes1","x":0,"width":104,"y":198,"height":87}
                subTextureData = textureAtlasData[subTextureName];
                rect = cc.rect(subTextureData.x,subTextureData.y,subTextureData.width,subTextureData.height);
                //create a SpriteFrame instance
                //cc.log('* region ' + subTextureName + ' x: ' + subTextureData.x + ' y: '+ subTextureData.y + ' w: ' + subTextureData.width + ' h: '+ subTextureData.height)
                spriteFrame = new cc.SpriteFrame(this.image,rect, subTextureData.rotated, subTextureData.offset, subTextureData.size);//
                this._regions[subTextureName] = spriteFrame;//textureAtlasData[subTextureName];
            }
        };
        return DBCCTextureAtlas;
    })();
    db.DBCCTextureAtlas = DBCCTextureAtlas;
})(db || (db = {}));