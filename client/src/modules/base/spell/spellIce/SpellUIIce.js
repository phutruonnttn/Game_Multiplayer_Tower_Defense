
var SpellUIIce = SpellUI.extend({

    ctor: function (gameMgr, card, position) {
        this._super(gameMgr, card, position)
        if (this.gameMgr.isPlayerMap) {
            this.animation.setPosition(cc.p(
                position.x,
                position.y + 4 * BATTLE.SQUARE_SIZE
                )
            );
        }
        else {
            this.animation.setPosition(cc.p(
                position.x,
                position.y - 4 * BATTLE.SQUARE_SIZE
                )
            );
        }
        this.action()
    },

    action: function () {
        var sequence = cc.sequence(
            // Cầu băng rơi từ trên xuống
            cc.callFunc(()=>{
                    this.animation.setAnimation(0, "animation_ice_ball", true)
                }
            ),
            cc.moveTo(BATTLE.DELAY_FRAME_FALL_ANIMATION / BATTLE.FRAME_PER_SECOND, this.position.x, this.position.y),
            cc.callFunc(()=>{
                    this.animation.setScale(this.range / SPELL.WIDTH[this.spellID])
                }
            ),

            // Cầu băng nổ
            cc.callFunc(()=>{
                    this.animation.setAnimation(0, "animation_full", false)
                }
            ),
            cc.callFunc(()=>{
                this.animation.setLocalZOrder(-1)
            }),
            cc.delayTime(2),

            // Xóa spell khỏi GUI
            cc.callFunc(()=>{
                    this.animation.removeFromParent(true)
                }
            )
        )

        this.animation.runAction(sequence)
    }
})