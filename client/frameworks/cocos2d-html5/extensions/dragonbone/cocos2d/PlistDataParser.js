/**
 * Created by KienVN on 7/20/2016.
 */


PlistDataParser =
    {
        _CCNS_REG1 : /^\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*$/,
        _CCNS_REG2 : /^\s*\{\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*,\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*\}\s*$/,
        parseTextureAtlasFile:function(filePath)
        {
            var dict = cc.loader.getRes(filePath);
            var tempFrames = dict["frames"], tempMeta = dict["metadata"] || dict["meta"];
            var frames = {}, meta = {};
            var format = 0;
            if(tempMeta){//init meta
                var tmpFormat = tempMeta["format"];
                format = (tmpFormat.length <= 1) ? parseInt(tmpFormat) : tmpFormat;
                meta.image = tempMeta["textureFileName"] || tempMeta["textureFileName"] || tempMeta["image"];
            }
            for (var key in tempFrames) {
                var frameDict = tempFrames[key];
                if(!frameDict) continue;
                var tempFrame = {};

                if (format == 0) {
                    tempFrame.rect = cc.rect(frameDict["x"], frameDict["y"], frameDict["width"], frameDict["height"]);
                    tempFrame.rotated = false;
                    tempFrame.offset = cc.p(frameDict["offsetX"], frameDict["offsetY"]);
                    var ow = frameDict["originalWidth"];
                    var oh = frameDict["originalHeight"];
                    // check ow/oh
                    if (!ow || !oh) {
                        cc.log(cc._LogInfos.spriteFrameCache__getFrameConfig);
                    }
                    // Math.abs ow/oh
                    ow = Math.abs(ow);
                    oh = Math.abs(oh);
                    tempFrame.size = cc.size(ow, oh);
                } else if (format == 1 || format == 2) {
                    tempFrame.rect = this._rectFromString(frameDict["frame"]);
                    tempFrame.rotated = frameDict["rotated"] || false;
                    tempFrame.offset = this._pointFromString(frameDict["offset"]);
                    tempFrame.size = this._sizeFromString(frameDict["sourceSize"]);
                } else if (format == 3) {
                    // get values
                    var spriteSize = this._sizeFromString(frameDict["spriteSize"]);
                    var textureRect = this._rectFromString(frameDict["textureRect"]);
                    if (spriteSize) {
                        textureRect = cc.rect(textureRect.x, textureRect.y, spriteSize.width, spriteSize.height);
                    }
                    tempFrame.rect = textureRect;
                    tempFrame.rotated = frameDict["textureRotated"] || false; // == "true";
                    tempFrame.offset = this._pointFromString(frameDict["spriteOffset"]);
                    tempFrame.size = this._sizeFromString(frameDict["spriteSourceSize"]);
                    tempFrame.aliases = frameDict["aliases"];
                } else {
                    var tmpFrame = frameDict["frame"], tmpSourceSize = frameDict["sourceSize"];
                    key = frameDict["filename"] || key;
                    tempFrame.rect = cc.rect(tmpFrame["x"], tmpFrame["y"], tmpFrame["w"], tmpFrame["h"]);
                    tempFrame.rotated = frameDict["rotated"] || false;
                    tempFrame.offset = cc.p(0, 0);
                    tempFrame.size = cc.size(tmpSourceSize["w"], tmpSourceSize["h"]);
                }
                var textureAtlasData = {};



                textureAtlasData.__name = key;
                var pos_ = key.lastIndexOf(".");
                if (pos_ != -1)
                {
                    textureAtlasData.__name = key.substr(0,pos_);
                }
                textureAtlasData.x = tempFrame.rect.x;
                textureAtlasData.y = tempFrame.rect.y;
                textureAtlasData.width = tempFrame.rect.width;
                textureAtlasData.height = tempFrame.rect.height;
                textureAtlasData.rotated = tempFrame.rotated;
                textureAtlasData.offset = tempFrame.offset;
                textureAtlasData.size = tempFrame.size;
                frames[textureAtlasData.__name] = textureAtlasData;
            }
            return frames;
        },
        _rectFromString :  function (content) {
            var result = this._CCNS_REG2.exec(content);
            if(!result) return cc.rect(0, 0, 0, 0);
            return cc.rect(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]), parseFloat(result[4]));
        },

        _pointFromString : function (content) {
            var result = this._CCNS_REG1.exec(content);
            if(!result) return cc.p(0,0);
            return cc.p(parseFloat(result[1]), parseFloat(result[2]));
        },

        _sizeFromString : function (content) {
            var result = this._CCNS_REG1.exec(content);
            if(!result) return cc.size(0, 0);
            return cc.size(parseFloat(result[1]), parseFloat(result[2]));
        }
    };