var Cell = cc.Class.extend({
    ctor: function (x, y){
        this.tower = null;
        this.obstacle = null;
        this.monsters = new MonsterList(this);
        this.point = cc.p(x, y)
    }
})