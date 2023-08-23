var SpellLogicHeal = SpellLogic.extend({

    ctor: function (card, gameMgr, position, isPlayerAction) {
        this._super(card, gameMgr, position, isPlayerAction)
        this.monsterActivated = {}
        this.timeExistence = this.stat.getDuration() * BATTLE.FRAME_PER_SECOND
        let buffTarget = JsonConfig.getInstance().getBuffTarget(this.stat.getAdjustValue("enemy"));
        this.durationOnTarget = Number(buffTarget.getDuration(1, card.level))
        this.delay = Number(buffTarget.getDelay(1))
        this.hpPerDelay = Number(buffTarget.getHpPerDelay(1, card.level))
    },

    update: function (dt) {
        this._super(dt)
        // Quet quai trong vung heal
        for (var i = 0; i < this.gameMgr.listLogicMonster.length; i++) {
            var monster = this.gameMgr.listLogicMonster[i]
            if (this.isInRange(monster.getPosition()) && this.monsterActivated[monster.getId()] == undefined && monster.canTarget()) {
                // nTick: so frame tac dung
                // f: bao nhieu frame 1 lan
                // hp: 1 lan bao nhieu hp
                monster.buffHpUp(
                    this.durationOnTarget * BATTLE.FRAME_PER_SECOND,
                    this.delay * BATTLE.FRAME_PER_SECOND / 1000,
                    this.hpPerDelay
                )
                this.monsterActivated[monster.getId()] = true
            }
        }
        this.timeExistence--
    }
})