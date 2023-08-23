

var fr = fr || {};

fr.createAtlasAnimation = function(source) {
    return new sp.SkeletonAnimation(source+".json",source+".atlas");
};