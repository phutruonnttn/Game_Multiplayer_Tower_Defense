var MonsterList = cc.Class.extend({

    ctor: function (cell){
        this.listMonter = [];
        this.cell = cell;
    },
    addMonster: function (monster){
        this.listMonter.push(monster);
    },
    removeMonster: function (monster){
        this.listMonter = this.listMonter.filter(function (m) {
            return monster != m;
        });
    },
    getListMonster: function () {
        return this.listMonter;
    }
})