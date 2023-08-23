//================================================================================
// By Min Heap
// Designed for Dijkstra Algorithm in MapLogic.getStepCountTableFromTarget()
//================================================================================
let PriorityQueue = cc.Class.extend({
    ctor: function () {
        // Mang du lieu, moi phan tu co thuoc tinh value,
        // currentCoordinate, parentCoordinate
        this.data = []
    },

    // Check xem trong hay khong?
    isEmpty: function (){
        return this.data.length === 0
    },

    // Day 1 phan tu vao hang hoi
    enqueue: function (item) {
        this.data.push(item)
        var index = this.data.length - 1
        while (index > 0) {
            var parentIndex = Math.floor((index-1)/2)
            if (this.data[parentIndex].value > this.data[index].value) {
                this.swap(index,parentIndex)
                index = parentIndex
            } else {
                break
            }
        }
    },

    swap: function (index1, index2) {
        var tmp = {
            "value": this.data[index1].value,
            "currentCoordinate": this.data[index1].currentCoordinate,
        }
        // data[i1] = data[i2]
        this.data[index1].value = this.data[index2].value
        this.data[index1].currentCoordinate = this.data[index2].currentCoordinate
        // data[i2] = tmp
        this.data[index2].value = tmp.value
        this.data[index2].currentCoordinate = tmp.currentCoordinate
    },

    // Lay phan tu dau tien (min) cua hang doi va xoa no
    dequeue: function () {
        if (this.isEmpty()) return undefined;
        this.swap(0, this.data.length-1)
        var index = 0
        while (index < this.data.length-2) {
            var indexLeftChild = index*2 + 1
            var indexRightChild = index*2 + 2
            if (indexLeftChild <= this.data.length-2 &&
                indexRightChild <= this.data.length-2){
                if (this.data[indexLeftChild].value > this.data[indexRightChild].value){
                    if (this.data[index].value > this.data[indexRightChild].value){
                        this.swap(index,indexRightChild)
                        index = indexRightChild
                        continue
                    }
                } else {
                    if (this.data[index].value > this.data[indexLeftChild].value){
                        this.swap(index,indexLeftChild)
                        index = indexLeftChild
                        continue
                    }
                }
            }
            if (indexLeftChild <= this.data.length-2 &&
                this.data[index].value > this.data[indexLeftChild].value) {
                this.swap(index,indexLeftChild)
                index = indexLeftChild
                continue
            }
            if (indexRightChild <= this.data.length-2 &&
                this.data[index].value > this.data[indexRightChild].value) {
                this.swap(index,indexRightChild)
                index = indexRightChild
                continue
            }
            break
        }
        return this.data.pop();
    }
})