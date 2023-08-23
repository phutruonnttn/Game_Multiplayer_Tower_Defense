let MapLogic = cc.Class.extend({
    ctor: function (){
        this.numberOfRows = BATTLE.ROWS
        this.numberOfColumns = BATTLE.COLUMNS
        this.startingCoordinates = BATTLE.STARTING_POINT
        this.targetCoordinates = BATTLE.TARGET_POINT
        this.tableOfCell = {}
        this.listPositionBuffCell = []

        // Cac thuoc tinh phuc vu viec sinh duong di ao
        this.currentVirualPath = []
        this.virtualPath = []
        this.maxScoreOfVirtualPath = 0
        this.isContinue = true
        this.isFindingBackCheck = false
        this.currentScoreOfVirtualPath = 0
        this.visited = {}
        this.weightTable = {}
        this.neighborBuffTable = {}
        this.currentBuffCellList = []
        this.backCheckPointStack = new Stack()
        this.currentBackCheckPoint = {}
        this.countExtensionCheckPoint = 0

        // De theo doi so lan thuc hien cua ham tim duong di ao
        this.countStep = 0
        this.countReachedTarget = 0

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
        this.addBuffCell()
        this.findVirtualPath()
        this.addHole()
        this.addTree()
    },

    addTree: function () {
        for (var i = 0; i < this.virtualPath.length-1; i++) {
            this.visited[this.virtualPath[i].x][this.virtualPath[i].y] = 1
        }
        for (var i = 0; i < BATTLE.NUMBER_OF_TREE; i++){
            var flagAdded = false
            for (var j = 1 ; j < this.virtualPath.length-1; j++) {
                if (flagAdded == true) {
                    break
                }
                var currentPoint = this.virtualPath[j]
                if  (this.isFork(j)) {
                    // Kiem tra xem co o cay nao chua
                    var flagExistedTree = false
                    for (var k = 0; k<BATTLE.LIST_4_DIRECTION.length; k++) {
                        var tmpPoint = cc.p(currentPoint.x + BATTLE.LIST_4_DIRECTION[k].x, currentPoint.y + BATTLE.LIST_4_DIRECTION[k].y)
                        if (this.isValidatePosition(tmpPoint) && (this.isTreeType(tmpPoint) || this.isHoleType(tmpPoint))) {
                            flagExistedTree = true
                            break
                        }
                    }
                    if (flagExistedTree) {
                        continue
                    }
                    // Kiem tra xem co o nao canh o nga re nay dat duoc cay khong
                    for (var k = 0; k<BATTLE.LIST_4_DIRECTION.length; k++) {
                        var tmpPoint = cc.p(currentPoint.x + BATTLE.LIST_4_DIRECTION[k].x, currentPoint.y + BATTLE.LIST_4_DIRECTION[k].y)
                        if (this.isValidatePosition(tmpPoint)) {
                            if (tmpPoint.x !=-1 &&this.visited[tmpPoint.x][tmpPoint.y] == 0 && !this.isBuffCell(tmpPoint)) {
                                // Kiem tra xem xung quanh o nay co o suc manh hay o cay nao khong?
                                var flagCanAddTree = true
                                for (var l = 0; l<BATTLE.LIST_8_DIRECTION.length; l++) {
                                    var neighborPoint = cc.p(tmpPoint.x + BATTLE.LIST_8_DIRECTION[l].x, tmpPoint.y + BATTLE.LIST_8_DIRECTION[l].y)
                                    if (this.isValidatePosition(neighborPoint) && (this.isTreeType(neighborPoint) || this.isBuffCell(neighborPoint) || this.isHoleType(neighborPoint))) {
                                        flagCanAddTree = false
                                        break
                                    }
                                }

                                if (flagCanAddTree) {
                                    this.addObstacle(tmpPoint.x, tmpPoint.y, BATTLE.TREE_TYPE)
                                    flagAdded = true
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    // Kiem tra re nhanh
    isFork: function (indexInVirtualPath) {
        var previousPoint = this.virtualPath[indexInVirtualPath-1]
        var nextPoint = this.virtualPath[indexInVirtualPath+1]
        if  (previousPoint.x != nextPoint.x && previousPoint.y != nextPoint.y) {
            return true
        }
        return false
    },

    isTreeType: function (point) {
        if (this.getTypeOfCell(point.x, point.y) == BATTLE.TREE_TYPE) {
            return true
        }
        return false
    },

    isHoleType: function (point) {
        if (this.getTypeOfCell(point.x, point.y) == BATTLE.HOLE_TYPE) {
            return true
        }
        return false
    },

    addHole: function () {
        for (var i = 0; i < this.virtualPath.length-1; i++) {
            this.visited[this.virtualPath[i].x][this.virtualPath[i].y] = 1
        }
        for (var i = 0; i < BATTLE.NUMBER_OF_HOLE; i++){
            var flagAdded = false
            for (var j = 1 ; j < this.virtualPath.length-1; j++) {
                if (flagAdded == true) {
                    break
                }
                var currentPoint = this.virtualPath[j]
                // Kiem tra xem co o nao canh o nga re nay dat duoc ho khong
                for (var k = 0; k<BATTLE.LIST_4_DIRECTION.length; k++) {
                    var tmpPoint = cc.p(currentPoint.x + BATTLE.LIST_4_DIRECTION[k].x, currentPoint.y + BATTLE.LIST_4_DIRECTION[k].y)
                    if (this.isValidatePosition(tmpPoint)) {
                        if (tmpPoint.x !=-1 && this.visited[tmpPoint.x][tmpPoint.y] == 0 && !this.isBuffCell(tmpPoint) && !this.isTreeType(tmpPoint)) {
                            // Kiem tra xem xung quanh o nay co o suc manh hay o cay nao khong?
                            var flagCanAddHole = false
                            for (var l = 0; l<BATTLE.LIST_8_DIRECTION.length; l++) {
                                var neighborPoint = cc.p(tmpPoint.x + BATTLE.LIST_8_DIRECTION[l].x, tmpPoint.y + BATTLE.LIST_8_DIRECTION[l].y)
                                if (this.isTreeType(neighborPoint) || this.isBuffCell(neighborPoint)) {
                                    flagCanAddHole = true
                                    break
                                }
                            }

                            if (!flagCanAddHole) {
                                this.addObstacle(tmpPoint.x, tmpPoint.y, BATTLE.HOLE_TYPE)
                                flagAdded = true
                                break
                            }
                        }
                    }
                }
            }
        }
    },

    quickSort: function(unSortedArr){
        if (unSortedArr.length < 2) return unSortedArr
        // Lấy phần tử giữa làm chốt
        const pivotIndex = Math.floor(unSortedArr.length / 2)
        const pivot = unSortedArr[pivotIndex]
        const leftArr = []
        const rightArr = []
        let currentItem

        // Loại bỏ phan tu pivot trong mảng
        unSortedArr.splice(pivotIndex, 1)

        for (let i = 0; i < unSortedArr.length; i++) {
            currentItem = unSortedArr[i]
            if (this.compare(currentItem, pivot) == 1) {
                leftArr.push(currentItem)
            } else {
                rightArr.push(currentItem)
            }
        }

        return [...this.quickSort(leftArr), pivot, ...this.quickSort(rightArr)]
    },

    // So sanh weight, neu weight = nhau thi so sanh index
    compare: function(a,b) {
        if (a.weight < b.weight) {
            return -1
        }  else if (a.weight > b.weight) {
            return 1
        } else {
            if (a.index < b.index) {
                return 1
            }  else if (a.index > b.index) {
                return -1
            } else {
                return 0
            }
        }
    },

    // Lay huong hien tai
    getCurrentDirection: function (){
        if (this.currentVirualPath.length == 1) {
            return BATTLE.PRIORITY_DIRECTION_LIST_INDEX_LEFT
        }
        var currentPoint = this.currentVirualPath[this.currentVirualPath.length-1]
        var previousPoint = this.currentVirualPath[this.currentVirualPath.length-2]

        if (currentPoint.x == previousPoint.x) {
            if (currentPoint.y == previousPoint.y+1) {
                return BATTLE.PRIORITY_DIRECTION_LIST_INDEX_RIGHT
            }
            if (currentPoint.y == previousPoint.y-1) {
                return BATTLE.PRIORITY_DIRECTION_LIST_INDEX_LEFT
            }
        }
        if (currentPoint.y == previousPoint.y) {
            if (currentPoint.x == previousPoint.x+1) {
                return BATTLE.PRIORITY_DIRECTION_LIST_INDEX_DOWN
            }
            if (currentPoint.x == previousPoint.x-1) {
                return BATTLE.PRIORITY_DIRECTION_LIST_INDEX_UP
            }
        }
    },

    // Lay huong uu tien de thuc hien ham Heuristic DFS
    getPriorityDirectionListForDFS: function (x,y,currentDirection) {
        var priorityList = []
        var direction = BATTLE.LIST_PRIORITY_DIRECTION_FOR_CURRENT_DIRECTION[currentDirection]

        for (var i = 0; i < direction.length; i++) {
            var tmpPoint = cc.p(x + direction[i].x, y + direction[i].y)
            if (this.isValidatePosition(tmpPoint) && this.isCanMoveDFS(cc.p(x,y),tmpPoint)) {
                // Neu y<=1 thi khong di xuong
                if (y<=1) {
                    if (direction[i].x == 1 && direction[i].y == 0) {
                        continue
                    }
                }
                // Neu x<=1 thi khong sang phai
                if (x<=1) {
                    if (direction[i].x == 0 && direction[i].y == 1) {
                        continue
                    }
                }
                var itemPriorityList
                if (tmpPoint.x==-1) {
                    itemPriorityList = {
                        "weight": BATTLE.INIT_WEIGHT,
                        "index": i
                    }
                } else {
                    itemPriorityList = {
                        "weight": this.weightTable[tmpPoint.x][tmpPoint.y],
                        "index": i
                    }
                }
                priorityList.push(itemPriorityList)
            }
        }
        return this.quickSort(priorityList)
    },

    // Add checkpoint vao stack neu di vao vung buff moi
    addBuffZoneToCheckPointStack: function (x,y) {
        for (var i = 0; i < this.neighborBuffTable[x][y].length; i++){
            if (this.currentBuffCellList[this.neighborBuffTable[x][y][i]] == 0) {
                this.currentBuffCellList[this.neighborBuffTable[x][y][i]] = 1
                this.backCheckPointStack.add(cc.p(x,y))
                return this.neighborBuffTable[x][y][i]
            }
        }
        return -1
    },

    // Add cac loai checkpoint khac vao stack
    addExtensionCheckPoint: function (x,y) {
        for (var i = 0; i<this.currentBuffCellList.length; i++) {
            if (this.currentBuffCellList[i] != 0) {
                return false
            }
        }
        if (y != BATTLE.TARGET_POINT.y && this.countExtensionCheckPoint<2) {
            this.backCheckPointStack.add(cc.p(x,y))
            this.countExtensionCheckPoint++
            return true
        }
        return false
    },

    removeBuffZoneFromCheckPointStack: function (indexBuffZone) {
        if (indexBuffZone == -1) {
            return
        }
        this.currentBuffCellList[indexBuffZone] = 0
        this.backCheckPointStack.pop()
        if (this.backCheckPointStack.isEmpty()) {
            this.isContinue = false
            return
        }
        this.currentBackCheckPoint = this.backCheckPointStack.top()
        if (this.isFindingBackCheck) {
            this.isContinue = false
        }
    },

    removeExtensionCheckPoint: function (flagAddBackCheck) {
        if (!flagAddBackCheck) {
            return
        }
        this.backCheckPointStack.pop()
        if (this.backCheckPointStack.isEmpty()) {
            this.isContinue = false
            return
        }
        this.currentBackCheckPoint = this.backCheckPointStack.top()
        this.countExtensionCheckPoint--
        if (this.isFindingBackCheck) {
            this.isContinue = false
        }
    },

    // Hàm để tạo đường đi ảo
    heuristicDepthFirstSearch: function (x,y){
        this.countStep++
        var currentDirection = this.getCurrentDirection()
        var priorityList = this.getPriorityDirectionListForDFS(x,y,currentDirection)
        var indexBuffZone = -1
        var flagAddBackCheck = false

        if (this.neighborBuffTable[x][y].length > 0) {
            indexBuffZone = this.addBuffZoneToCheckPointStack(x,y)
        } else {
            flagAddBackCheck = this.addExtensionCheckPoint(x,y)
        }

        var direction = BATTLE.LIST_PRIORITY_DIRECTION_FOR_CURRENT_DIRECTION[currentDirection]
        for (var i = 0; i < priorityList.length; i++) {
            var tmpPoint = cc.p(x + direction[priorityList[i].index].x, y + direction[priorityList[i].index].y)
            var score = this.calculateScore(tmpPoint)
            this.currentVirualPath.push(tmpPoint)
            this.currentScoreOfVirtualPath += score

            if (this.isTargetPoint(tmpPoint)) {
                this.reachedTarget()
                this.currentScoreOfVirtualPath -= score
                break
            }

            if (tmpPoint.x != -1) {
                this.visited[tmpPoint.x][tmpPoint.y] = 1
            }

            this.heuristicDepthFirstSearch(tmpPoint.x, tmpPoint.y)

            this.currentScoreOfVirtualPath -= score
            this.currentVirualPath.pop()
            if (tmpPoint.x != -1) {
                this.visited[tmpPoint.x][tmpPoint.y] = 0
            }
            if (!this.isContinue)  {
                if (x==this.currentBackCheckPoint.x && y==this.currentBackCheckPoint.y && i < priorityList.length-1) {
                    this.isContinue = true
                    this.isFindingBackCheck = false
                } else {
                    break
                }
            }
        }
        this.removeBuffZoneFromCheckPointStack(indexBuffZone)
        this.removeExtensionCheckPoint(flagAddBackCheck)
    },

    isTargetPoint: function(point) {
        return (point.x == BATTLE.STARTING_POINT.x-1 && point.y == BATTLE.STARTING_POINT.y)
    },

    calculateScore: function (nextPoint) {
        var score = BATTLE.SCORE_STRAIGHT
        var prePoint
        if (this.currentVirualPath.length == 1) {
            prePoint = cc.p(BATTLE.TARGET_POINT.x, BATTLE.TARGET_POINT.y+1)
        } else {
            prePoint = this.currentVirualPath[this.currentVirualPath.length-2]
        }
        if (this.isTurn(prePoint,nextPoint)) {
            score += BATTLE.SCORE_TURN
        }
        if (this.isBuffNeighbor(nextPoint)) {
            score += BATTLE.SCORE_BUFF_NEIGHBOR
        }
        return score
    },

    reachedTarget: function () {
        this.countReachedTarget ++
        this.isContinue = false
        this.isFindingBackCheck = true
        if (this.currentScoreOfVirtualPath > this.maxScoreOfVirtualPath) {
            this.maxScoreOfVirtualPath = this.currentScoreOfVirtualPath
            this.virtualPath.splice(0,this.virtualPath.length)
            for (var i = 0; i< this.currentVirualPath.length; i++) {
                this.virtualPath.push(this.currentVirualPath[i])
            }
        }
        this.currentBackCheckPoint = this.backCheckPointStack.top()
        this.currentVirualPath.pop()
    },

    isCanMoveDFS: function (currentPoint, nextPoint){
        if (this.isBuffCell(nextPoint)) {
            return false
        }
        if  (nextPoint.x != -1 && this.visited[nextPoint.x][nextPoint.y] == 1) {
            return false
        }
        for (var i = 0; i < BATTLE.LIST_4_DIRECTION.length; i++){
            var tmpPoint = cc.p(nextPoint.x+BATTLE.LIST_4_DIRECTION[i].x,nextPoint.y+BATTLE.LIST_4_DIRECTION[i].y)
            if (this.isValidatePosition(tmpPoint)) {
                if  (tmpPoint.x == currentPoint.x && tmpPoint.y == currentPoint.y) {
                    continue
                }
                if (tmpPoint.x!=-1 && this.visited[tmpPoint.x][tmpPoint.y] == 1) {
                    return false
                }
            }
        }
        return true
    },

    // Trung binh duyet 5-6 x n lan DFS
    findVirtualPath: function () {
        for (var i = 0; i < this.getNumberOfRows(); i++) {
            this.visited[i] = []
            for (var j = 0; j < this.getNumberOfColumns(); j++) {
                this.visited[i][j] = 0
            }
        }
        this.countStep = 0
        this.countReachedTarget = 0
        this.isContinue = true
        this.isFindingBackCheck = false
        this.currentVirualPath = []
        this.currentVirualPath.push(BATTLE.TARGET_POINT)
        this.currentScoreOfVirtualPath = 0
        this.countExtensionCheckPoint = 0
        this.visited[BATTLE.TARGET_POINT.x][BATTLE.TARGET_POINT.y] = 1
        for (var i = 0; i<this.listPositionBuffCell.length; i++) {
            this.currentBuffCellList[i] = 0
        }
        this.initNeighborBuffTable()
        this.initWeightTable()
        this.backCheckPointStack.clear()

        // Find virtual path
        this.heuristicDepthFirstSearch(BATTLE.TARGET_POINT.x, BATTLE.TARGET_POINT.y)
        cc.log("Duyet: " + this.countStep + " - Den dich: " + this.countReachedTarget)
        return this.virtualPath
    },

    initNeighborBuffTable: function () {
        for (var i = 0; i < this.numberOfRows; i++) {
            this.neighborBuffTable[i] = []
            for (var j = 0; j < this.numberOfColumns+1; j++) {
                this.neighborBuffTable[i][j] = []
            }
        }
        for (var i = 0; i<this.listPositionBuffCell.length; i++) {
            for (var j = 0; j<BATTLE.LIST_8_DIRECTION.length; j++) {
                var neighbor = cc.p(this.listPositionBuffCell[i].x + BATTLE.LIST_8_DIRECTION[j].x,
                    this.listPositionBuffCell[i].y + BATTLE.LIST_8_DIRECTION[j].y)
                if (this.isValidatePosition(neighbor)){
                    this.neighborBuffTable[neighbor.x][neighbor.y].push(i)
                }
            }
        }
    },

    initWeightTable: function (){
        var listBuffNeighbor = []
        for (var i = 0; i < this.getNumberOfRows(); i++) {
            this.weightTable[i] = []
            for (var j = 0; j < this.getNumberOfColumns()+1; j++) {
                if (this.isBuffCell(cc.p(i,j))){
                    this.weightTable[i][j] = -1
                    continue
                }
                if (this.isBuffNeighbor(cc.p(i,j))){
                    this.weightTable[i][j] = BATTLE.INIT_WEIGHT
                    listBuffNeighbor.push((cc.p(i,j)))
                    continue
                }
                this.weightTable[i][j] = 0
            }
        }
        for (var i=0; i<listBuffNeighbor.length; i++) {
            this.spreadWeight(listBuffNeighbor[i])
        }
    },

    // Dung bfs de danh trong so
    spreadWeight: function (startingPoint) {
        var queue = new Queue()

        // Tim duong tu diem (x,y)
        queue.enqueue(startingPoint)

        // Su dung thuat toan BFS
        while (!queue.isEmpty()) {
            var currentPoint = queue.dequeue();
            for (var i = 0; i < BATTLE.LIST_4_DIRECTION.length; i++) {
                var nextPoint = cc.p(currentPoint.x + BATTLE.LIST_4_DIRECTION[i].x, currentPoint.y + BATTLE.LIST_4_DIRECTION[i].y)
                if (this.isValidatePosition(nextPoint)) {
                    if (nextPoint.x == -1) {
                        continue
                    }
                    if (this.weightTable[nextPoint.x][nextPoint.y] == 0) {
                        var maxWeight = 0
                        for (var j = 0; j < BATTLE.LIST_4_DIRECTION.length; j++) {
                            var neighborPoint = cc.p(nextPoint.x + BATTLE.LIST_4_DIRECTION[j].x, nextPoint.y + BATTLE.LIST_4_DIRECTION[j].y)
                            if (this.isValidatePosition(neighborPoint)) {
                                if (neighborPoint.x == -1) {
                                    continue
                                }
                                maxWeight = Math.max(maxWeight, this.weightTable[neighborPoint.x][neighborPoint.y])
                            }
                        }
                        this.weightTable[nextPoint.x][nextPoint.y] = maxWeight/2
                        queue.enqueue(cc.p(nextPoint.x, nextPoint.y))
                    }
                }
            }
        }
    },

    isTurn: function (previousPoint, nextPoint){
        if (previousPoint.x == -3) {
            return false
        }
        if (previousPoint.x != nextPoint.x && previousPoint.y!=nextPoint.y) {
            return true
        }
        return false
    },

    isBuffNeighbor: function (point){
        for (var i = 0; i < BATTLE.LIST_4_DIRECTION.length; i++){
            var tmpPoint = cc.p(point.x+BATTLE.LIST_4_DIRECTION[i].x,point.y+BATTLE.LIST_4_DIRECTION[i].y)
            if (this.isValidatePosition(tmpPoint)) {
                if (this.isBuffCell(tmpPoint)) {
                    return true
                }
            }
        }
        return false
    },

    isBuffCell: function (point) {
        if (point.x>=1 && point.y>=1 && point.x<=BATTLE.RANGE_BUFF_ROWS && point.y<=BATTLE.RANGE_BUFF_CLOUMNS) {
            return (this.getBuffOfCell(point.x, point.y) != BATTLE.NO_BUFF)
        }
        return false
    },

    isValidatePosition: function (point) {
        if (point.x == BATTLE.TARGET_POINT.x && point.y == BATTLE.TARGET_POINT.y) {
            return true
        }

        if (point.x == BATTLE.STARTING_POINT.x-1 && point.y == BATTLE.STARTING_POINT.y) {
            return true
        }

        if (point.x >=0 && point.y >= 0 && point.x < this.getNumberOfRows() && point.y < this.getNumberOfColumns()) {
            return true
        }

        return false
    },

    addBuffCell: function () {
        this.addRandomBuffCell(0)
        this.addRandomBuffCell(1)

        while(!this.addRandomBuffCell(2)) {
            this.removeAllBuffCell()
            this.addRandomBuffCell(0)
            this.addRandomBuffCell(1)
        }
    },

    addRandomBuffCell: function (type) {
        var flag = false
        var x = 1 + Math.floor(Math.random() * BATTLE.RANGE_BUFF_ROWS)
        var y = 1 + Math.floor(Math.random() * BATTLE.RANGE_BUFF_CLOUMNS)
        var tmpX = x

        if (this.isHaveNeighborBuffIncludingCrossCell(x,y) || this.getBuffOfCell(x,y) != BATTLE.NO_BUFF || !this.isInBuffRange(x,y)) {
            for (x = tmpX; x <= BATTLE.RANGE_BUFF_ROWS; x++) {
                for (y = 1; y <= BATTLE.RANGE_BUFF_CLOUMNS; y++) {
                    if (this.getBuffOfCell(x,y) == BATTLE.NO_BUFF && !this.isHaveNeighborBuffIncludingCrossCell(x,y) && this.isInBuffRange(x,y)){
                        flag = true
                        break;
                    }
                }
                if (flag) {
                    break
                }
            }

            if (!flag) {
                for (x = tmpX; x >= 1; x--) {
                    for (y = BATTLE.RANGE_BUFF_CLOUMNS; y >= 1; y--) {
                        if (this.getBuffOfCell(x,y) == BATTLE.NO_BUFF && !this.isHaveNeighborBuffIncludingCrossCell(x,y) && this.isInBuffRange(x,y)) {
                            flag = true
                            break;
                        }
                    }
                    if (flag) {
                        break
                    }
                }
            }
        } else {
            this.addBuffType(x,y,type)
            return true
        }

        if (flag) {
            this.addBuffType(x,y,type)
            return true
        }
        return false
    },

    isInBuffRange: function (x,y) {
        if (x == 1 && y == 1) {
            return false
        }

        if (x>=1 && y>=1 && x<=BATTLE.RANGE_BUFF_ROWS && y<=BATTLE.RANGE_BUFF_CLOUMNS) {
            return true
        }

        return false
    },

    isHaveNeighborBuffIncludingCrossCell: function (x,y){
        for (var i = 0; i < BATTLE.LIST_8_DIRECTION.length; i++) {
            var tmpPoint = cc.p(x+BATTLE.LIST_8_DIRECTION[i].x, y+BATTLE.LIST_8_DIRECTION[i].y)
            if (tmpPoint.x>=1 && tmpPoint.y>=1 && tmpPoint.x<=BATTLE.RANGE_BUFF_ROWS && tmpPoint.y<=BATTLE.RANGE_BUFF_CLOUMNS) {
                if (this.getBuffOfCell(tmpPoint.x,tmpPoint.y) != BATTLE.NO_BUFF) {
                    return true
                }
            }
        }
        return false
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

    // Lấy type ở ô (x,y)
    getTypeOfCell: function (x,y) {
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
    }
})