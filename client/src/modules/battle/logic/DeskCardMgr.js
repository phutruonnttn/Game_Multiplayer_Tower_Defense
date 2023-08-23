let DeskCardMgr = cc.Class.extend({

    ctor: function (listDeskCard, listDeskCardLevel) {
        this.index = -1
        this.numberOfCard = 8
        this.showed = []
        this.listCard = []

        for (let i = 0; i < listDeskCard.length; i++) {
            this.listCard.push(new Card({
                id: listDeskCard[i],
                level: listDeskCardLevel[i],
            }))
        }

        for (var i = 0; i < this.numberOfCard; i++) {
            this.showed[i] = false
        }
    },

    getNextIndex: function () {
        do {
            this.index = (this.index + 1) % this.numberOfCard
        } while (this.showed[this.index])
        this.showed[this.index] = true
        return this.index
    },

    getNextIndexForCardNext: function () {
        var tmpIndex = this.index
        do {
            tmpIndex = (tmpIndex + 1) % this.numberOfCard
        } while (this.showed[tmpIndex])
        return tmpIndex
    },

    hideCard: function (index) {
        this.showed[index] = false
    }
})