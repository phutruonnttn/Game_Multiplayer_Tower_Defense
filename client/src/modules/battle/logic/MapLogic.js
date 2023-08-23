let MapLogic = cc.Class.extend({
    ctor: function (mapGenerate){
        this.mapGenerate = mapGenerate
        this.numberOfRows = BATTLE.ROWS
        this.numberOfColumns = BATTLE.COLUMNS
        this.startingCoordinates = BATTLE.STARTING_POINT
        this.targetCoordinates = BATTLE.TARGET_POINT
        this.tableOfCell = {}
        this.listPositionBuffCell = []
        this.virtualPath = []

        this.initMap()
    },

    initMap: function () {
        for (var i = 0; i < this.numberOfRows; i++) {
            this.tableOfCell[i] = []
            for (var j = 0; j < this.numberOfColumns; j++) {
                this.tableOfCell[i][j] = {}
                this.tableOfCell[i][j].type = BATTLE.LAND_TYPE
                this.tableOfCell[i][j].buff = BATTLE.NO_BUFF
            }
        }

        this.loadMapGenerate()
        this.updateStepCountFromTarget()
    },

    loadMapGenerate: function () {
        // Load virtual path
        this.virtualPath = this.mapGenerate.arrVirtualPath

        // Load hole
        var positionHole = this.mapGenerate.positionHole
        this.addObstacle(positionHole.x, positionHole.y, BATTLE.HOLE_TYPE)

        // Add tree
        var listTree = this.mapGenerate.arrPositionTree
        for (var i = 0; i < listTree.length; i++) {
            this.addObstacle(listTree[i].x, listTree[i].y, BATTLE.TREE_TYPE)
        }

        // Add buff
        var listBuff = this.mapGenerate.arrPositionBuff
        for (var i = 0; i < 3; i++) {
            this.addBuffType(listBuff[i].x, listBuff[i].y, i)
        }
    },

    getPriorityDirectionOfNextPoint: function (previousPoint, currentPoint){
        if (previousPoint.x < BATTLE.STARTING_POINT.x || previousPoint.x + 1 == currentPoint.x) {
            return BATTLE.BOTTOM_NEIGHBOR_INDEX
        }
        if (previousPoint.x - 1 == currentPoint.x) {
            return BATTLE.TOP_NEIGHBOR_INDEX
        }
        if (previousPoint.y + 1 == currentPoint.y) {
            return BATTLE.RIGHT_NEIGHBOR_INDEX
        }
        return BATTLE.LEFT_NEIGHBOR_INDEX
    },

    // Trả về điểm đến tiếp theo của monster từ vị trí (x,y)
    // Uu tien huong dang di
    getNextPointOfMonster: function (previousPoint,x,y){
        if (x == BATTLE.STARTING_POINT.x-1 && y == BATTLE.STARTING_POINT.y+1) {
            return cc.p(BATTLE.STARTING_POINT.x-1, BATTLE.STARTING_POINT.y)
        }
        if (x == BATTLE.STARTING_POINT.x-1 && y == BATTLE.STARTING_POINT.y) {
            return cc.p(BATTLE.STARTING_POINT.x,BATTLE.STARTING_POINT.y)
        }
        var nextPointByFindPath = this.getNextPointOfPath(previousPoint,x,y)
        var nextPoint = cc.p(-1,-1)
        var stepCountOfNextPoint = BATTLE.BIG_NUMBER
        var doubleDirection = [...BATTLE.LIST_4_DIRECTION,...BATTLE.LIST_4_DIRECTION]
        var priorityDirection = this.getPriorityDirectionOfNextPoint(previousPoint, cc.p(x,y))
        for (var i = priorityDirection; i < priorityDirection + BATTLE.LIST_4_DIRECTION.length; i++) {
            var tmpNextPoint = cc.p(x + doubleDirection[i].x, y + doubleDirection[i].y)
            if (tmpNextPoint.x >= -1 && tmpNextPoint.x <= this.getNumberOfRows()
                && tmpNextPoint.y>=-1 && tmpNextPoint.y <= this.getNumberOfColumns()) {
                if (this.stepCountFromTarget[tmpNextPoint.x+1][tmpNextPoint.y+1] < stepCountOfNextPoint) {
                    stepCountOfNextPoint = this.stepCountFromTarget[tmpNextPoint.x+1][tmpNextPoint.y+1]
                    nextPoint = cc.p(tmpNextPoint.x,tmpNextPoint.y)
                }
            }
        }

        if (nextPointByFindPath.x != -1) {
            if (this.stepCountFromTarget[nextPointByFindPath.x+1][nextPointByFindPath.y+1] >
                this.stepCountFromTarget[nextPoint.x+1][nextPoint.y+1]) {
                return nextPoint
            } else {
                return nextPointByFindPath
            }
        }
        return nextPoint
    },

    // Xu ly khi diem tiep theo theo chieu doc
    getNextPointOfPathVertical: function (previousPoint,x,y) {
        if (this.stepCountFromTarget[previousPoint.x + 1][previousPoint.y + 1] == this.stepCountFromTarget[x + 1][y + 1] + BATTLE.COST_STRAIGHT_DIJKSTRA) {
            if (x+1 < this.getNumberOfRows() && this.getTypeOfCell(x+1,y) == BATTLE.LAND_TYPE && previousPoint.x < x) {
                return cc.p(x + 1, y)
            }
            if (x-1 >=0 && this.getTypeOfCell(x-1,y) == BATTLE.LAND_TYPE && previousPoint.x > x) {
                return cc.p(x - 1, y)
            }
        }
        if (this.stepCountFromTarget[previousPoint.x + 1][previousPoint.y + 1] == this.stepCountFromTarget[x + 1][y + 1] + BATTLE.COST_TURN_DIJKSTRA + BATTLE.COST_STRAIGHT_DIJKSTRA) {
            var maxColumn = this.getNumberOfColumns()
            if (x == BATTLE.ROWS-1) {
                maxColumn ++
            }
            if (y-1>=0 && y+1 < maxColumn && this.getTypeOfCell(x,y-1) == BATTLE.LAND_TYPE && this.getTypeOfCell(x,y+1) == BATTLE.LAND_TYPE){
                if (this.stepCountFromTarget[x + 1][y + 1 + 1] > this.stepCountFromTarget[x + 1][y - 1 + 1]){
                    return cc.p(x,y-1)
                }
                if (this.stepCountFromTarget[x + 1][y + 1 + 1] < this.stepCountFromTarget[x + 1][y - 1 + 1]){
                    return cc.p(x,y+1)
                }
            }
            if (y-1>=0 && this.getTypeOfCell(x,y-1) == BATTLE.LAND_TYPE) {
                return cc.p(x,y-1)
            }
            if (y+1 < maxColumn && this.getTypeOfCell(x,y+1) == BATTLE.LAND_TYPE) {
                return cc.p(x, y+1)
            }
        }
        return cc.p(-1,-1)
    },

    // Xu ly khi diem tiep theo theo chieu ngang
    getNextPointOfPathHorizontal: function (previousPoint,x,y) {
        if (this.stepCountFromTarget[previousPoint.x + 1][previousPoint.y + 1] == this.stepCountFromTarget[x + 1][y + 1] + BATTLE.COST_STRAIGHT_DIJKSTRA) {
            var maxColumn = this.getNumberOfColumns()
            if (x == BATTLE.ROWS-1) {
                maxColumn ++
            }
            if (y+1 < maxColumn && this.getTypeOfCell(x,y+1) == BATTLE.LAND_TYPE && previousPoint.y < y) {
                return cc.p(x , y + 1)
            }
            if (y-1 >=0 && this.getTypeOfCell(x,y-1) == BATTLE.LAND_TYPE && previousPoint.y > y) {
                return cc.p(x , y - 1)
            }
        }
        if (this.stepCountFromTarget[previousPoint.x + 1][previousPoint.y + 1] == this.stepCountFromTarget[x + 1][y + 1] + BATTLE.COST_TURN_DIJKSTRA + BATTLE.COST_STRAIGHT_DIJKSTRA) {
            if (x-1 >=0 && x+1<this.getNumberOfRows() && this.getTypeOfCell(x-1,y) == BATTLE.LAND_TYPE && this.getTypeOfCell(x+1,y) == BATTLE.LAND_TYPE) {
                if (this.stepCountFromTarget[x + 1 + 1][y + 1] > this.stepCountFromTarget[x - 1 + 1][y + 1]){
                    return cc.p(x - 1,y)
                }
                if (this.stepCountFromTarget[x + 1 + 1][y + 1] < this.stepCountFromTarget[x - 1 + 1][y + 1]){
                    return cc.p(x+1,y)
                }
            }
            if (x-1 >=0 && this.getTypeOfCell(x-1,y) == BATTLE.LAND_TYPE) {
                return cc.p(x-1, y)
            }
            if (x+1 < this.getNumberOfRows() && this.getTypeOfCell(x+1,y) == BATTLE.LAND_TYPE) {
                return cc.p(x+1, y)
            }
        }
        return cc.p(-1,-1)
    },

    getNextPointOfPath: function (previousPoint,x,y) {
        if (x == BATTLE.STARTING_POINT.x-1 && y == BATTLE.STARTING_POINT.y) {
            return BATTLE.STARTING_POINT
        }

        // Xet truong hop di doc
        if (previousPoint.y == y) {
            return this.getNextPointOfPathVertical(previousPoint,x,y)
        }

        // Xet truong hop di ngang
        if (previousPoint.x == x) {
            return this.getNextPointOfPathHorizontal(previousPoint,x,y)
        }

        return cc.p(-1,-1)
    },

    // Kiem tra xem sau khi them vat can vao o (x,y) thi co duong den tu diem dau den diem dich hay khong
    isCanMoveToTargetPointAfterAddObstacle: function (x,y) {
        if (x==this.getStartingCoordinates().x && y ==this.getStartingCoordinates().y){
            return false
        }
        if (x==this.getTargetCoordinates().x && y ==this.getTargetCoordinates().y) {
            return false
        }
        this.addObstacle(x, y, BATTLE.TMP_TYPE)
        var startingPoint = this.getStartingCoordinates()
        var isExistPath = this.isExistPathOfMonster(startingPoint.x, startingPoint.y)
        this.addObstacle(x, y, BATTLE.LAND_TYPE)
        return isExistPath
    },

    // Thay doi type vat can tai vi tri (x,y) trong map thanh type
    // va khoi tao doi tuong obstacle type tai vi tri do
    addObstacle: function (x,y,type){
        this.tableOfCell[x][y].type = type
    },

    addBuffType: function (x,y,type){
        this.listPositionBuffCell.push(cc.p(x,y))
        this.tableOfCell[x][y].buff = type
    },

    removeAllBuffCell: function () {
        for (var i = 0; i < this.listPositionBuffCell.length; i++) {
            this.tableOfCell[this.listPositionBuffCell[i].x][this.listPositionBuffCell[i].y].buff = BATTLE.NO_BUFF
        }
        this.listPositionBuffCell = []
    },

    // Kiem tra xem con duong di cho quai vat tu (x,y) den dich khong
    isExistPathOfMonster: function (x,y){
        var tracePath = {}
        for (var i = 0; i < this.getNumberOfRows(); i++) {
            tracePath[i] = []
            for (var j = 0; j < this.getNumberOfColumns(); j++) {
                tracePath[i][j] = cc.p(BATTLE.FLAG_TRACE_INIT,BATTLE.FLAG_TRACE_INIT)
            }
        }
        var startingPoint = cc.p(x,y)
        var targetPoint = cc.p(BATTLE.TARGET_POINT.x, BATTLE.TARGET_POINT.y-1)
        var queue = new Queue()

        // Tim duong tu diem (x,y)
        queue.enqueue(startingPoint)
        tracePath[startingPoint.x][startingPoint.y] = cc.p(BATTLE.FLAG_TRACE_CHECKED, BATTLE.FLAG_TRACE_CHECKED)

        // Bat dau tim duong di su dung thuat toan BFS
        while (!queue.isEmpty()) {
            var currentPoint = queue.dequeue();
            if (currentPoint.x == targetPoint.x && currentPoint.y == targetPoint.y) {
                return true
            }
            for (var i = 0; i < BATTLE.LIST_4_DIRECTION.length; i++) {
                var nextPoint = cc.p(currentPoint.x + BATTLE.LIST_4_DIRECTION[i].x, currentPoint.y + BATTLE.LIST_4_DIRECTION[i].y)
                if (nextPoint.x >= 0 && nextPoint.x < this.getNumberOfRows() && nextPoint.y>=0 && nextPoint.y < this.getNumberOfColumns()) {
                    if (this.getTypeOfCell(nextPoint.x, nextPoint.y) == BATTLE.LAND_TYPE && tracePath[nextPoint.x][nextPoint.y].x == BATTLE.FLAG_TRACE_INIT) {
                        tracePath[nextPoint.x][nextPoint.y] = currentPoint;
                        queue.enqueue(cc.p(nextPoint.x, nextPoint.y))
                    }
                }
            }
        }
        return false
    },

    updateStepCountFromTarget: function () {
        this.stepCountFromTarget = this.getStepCountTableFromTarget(BATTLE.TARGET_POINT)
    },

    // Su dung thuat toan Dijkstra
    getStepCountTableFromTarget: function (target){
        var stepCount = {}
        var listParentCoordinate = {}

        // Bat dau tu vi tri (-1,0) do do mang stepCount se duoc them 1 cot va 1 dong
        for (var i = 0; i < this.getNumberOfRows()+2; i++) {
            stepCount[i] = []
            listParentCoordinate[i] = []
            for (var j = 0; j < this.getNumberOfColumns()+2; j++) {
                stepCount[i][j] = BATTLE.BIG_NUMBER
                listParentCoordinate[i][j] = []
            }
        }

        var targetPoint = cc.p(target.x+1, target.y+1)
        var priorityQueue = new PriorityQueue()
        stepCount[targetPoint.x][targetPoint.y] = 0
        priorityQueue.enqueue({
            "value": stepCount[targetPoint.x][targetPoint.y],
            "currentCoordinate": targetPoint
        })
        listParentCoordinate[targetPoint.x][targetPoint.y].push(cc.p(-1,-1))

        // Thuat toan Dijkstra
        while (!priorityQueue.isEmpty()){
            var currentPoint = priorityQueue.dequeue()
            for (var i = 0; i < BATTLE.LIST_4_DIRECTION.length; i++) {
                var nextPoint = cc.p(currentPoint.currentCoordinate.x + BATTLE.LIST_4_DIRECTION[i].x,
                    currentPoint.currentCoordinate.y + BATTLE.LIST_4_DIRECTION[i].y)
                if (nextPoint.x >= 0 && nextPoint.x < this.getNumberOfRows()+2 && nextPoint.y>=0
                    && nextPoint.y < this.getNumberOfColumns()+2 && this.getTypeOfCell(nextPoint.x-1, nextPoint.y-1) == BATTLE.LAND_TYPE) {

                    var cost = this.getCost(nextPoint, listParentCoordinate[currentPoint.currentCoordinate.x][currentPoint.currentCoordinate.y])

                    // Neu chi phi bang chi phi hien tai thi luu lai o cha
                    if (stepCount[nextPoint.x][nextPoint.y] == stepCount[currentPoint.currentCoordinate.x][currentPoint.currentCoordinate.y] + cost) {
                        listParentCoordinate[nextPoint.x][nextPoint.y].push(cc.p(currentPoint.currentCoordinate.x, currentPoint.currentCoordinate.y))
                    }

                    // Cap nhap lai o cha va chi phi moi
                    if (stepCount[nextPoint.x][nextPoint.y] > stepCount[currentPoint.currentCoordinate.x][currentPoint.currentCoordinate.y] + cost) {
                        stepCount[nextPoint.x][nextPoint.y] = stepCount[currentPoint.currentCoordinate.x][currentPoint.currentCoordinate.y] + cost

                        listParentCoordinate[nextPoint.x][nextPoint.y].splice(0,listParentCoordinate[nextPoint.x][nextPoint.y].length)
                        listParentCoordinate[nextPoint.x][nextPoint.y].push(cc.p(currentPoint.currentCoordinate.x, currentPoint.currentCoordinate.y))

                        priorityQueue.enqueue({
                            "value" : stepCount[nextPoint.x][nextPoint.y],
                            "currentCoordinate": nextPoint
                        });
                    }
                }
            }
        }
        return stepCount
    },

    // Chi phi de di tu diem current den diem next
    // Neu tu previous den next la re nhanh thi cost = BATTLE.COST_TURN_DIJKSTRA + BATTLE.COST_STRAIGHT_DIJKSTRA
    // nguoc lai thi cost = BATTLE.COST_STRAIGHT_DIJKSTRA
    getCost: function (nextPoint, listParentCoordinate) {
        for (var i = 0; i < listParentCoordinate.length; i++) {
            if (listParentCoordinate[i].x == -1) {
                return BATTLE.COST_STRAIGHT_DIJKSTRA
            }
            if (nextPoint.x == listParentCoordinate[i].x || nextPoint.y == listParentCoordinate[i].y) {
                return BATTLE.COST_STRAIGHT_DIJKSTRA
            }
        }
        return BATTLE.COST_TURN_DIJKSTRA + BATTLE.COST_STRAIGHT_DIJKSTRA
    },

    // Lấy type ở ô (x,y)
    getTypeOfCell: function (x,y) {
        // //o gate
        // if (x == -1 && y == 1) return BATTLE.LAND_TYPE

        // O canh monster gate
        if (x == -1 && y == 0) return BATTLE.LAND_TYPE
        // O house
        if (x == BATTLE.ROWS - 1 && y == BATTLE.COLUMNS) return BATTLE.LAND_TYPE

        if (x==-1 || y==-1 || x==BATTLE.ROWS || y==BATTLE.COLUMNS) return BATTLE.TMP_TYPE
        return this.tableOfCell[x][y].type
    },

    getBuffOfCell: function (x,y) {
        return this.tableOfCell[x][y].buff
    },

    getNumberOfRows: function (){
        return this.numberOfRows
    },

    getNumberOfColumns: function (){
        return this.numberOfColumns
    },

    getStartingCoordinates: function (){
        return this.startingCoordinates
    },

    getTargetCoordinates: function (){
        return this.targetCoordinates
    }
})