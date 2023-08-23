package dsa;

import java.util.ArrayList;

public class PriorityQueue {
    private ArrayList<PointOfPriorityQueue> data;
    public PriorityQueue () {
        // Mang du lieu, moi phan tu co thuoc tinh value, currentCoordinate
        data = new ArrayList<>();
    }

    // Check xem trong hay khong?
    public boolean isEmpty(){
        return data.isEmpty();
    }

    // Day 1 phan tu vao hang hoi
    public void enqueue(PointOfPriorityQueue item) {
        data.add(item);
        int index = data.size() - 1;
        while (index > 0) {
            int parentIndex = (int) Math.floor((index-1)/2);
            if (data.get(parentIndex).value > data.get(index).value) {
                swap(index,parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    public void swap(int index1,int index2) {
        PointOfPriorityQueue tmp = new PointOfPriorityQueue(data.get(index1).value, data.get(index1).currentCoordinate);
        // data[i1] = data[i2]
        data.get(index1).value = data.get(index2).value;
        data.get(index1).currentCoordinate = data.get(index2).currentCoordinate;
        // data[i2] = tmp
        data.get(index2).value = tmp.value;
        data.get(index2).currentCoordinate = tmp.currentCoordinate;
    }

    // Lay phan tu dau tien (min) cua hang doi va xoa no
    public PointOfPriorityQueue dequeue() {
        if (isEmpty()) return null;
        swap(0, data.size()-1);
        int index = 0;
        while (index < data.size()-2) {
            int indexLeftChild = index*2 + 1;
            int indexRightChild = index*2 + 2;
            if (indexLeftChild <= data.size()-2 &&
                    indexRightChild <= data.size()-2){
                if (data.get(indexLeftChild).value > data.get(indexRightChild).value){
                    if (data.get(index).value > data.get(indexRightChild).value){
                        swap(index,indexRightChild);
                        index = indexRightChild;
                        continue;
                    }
                } else {
                    if (data.get(index).value > data.get(indexLeftChild).value){
                        swap(index,indexLeftChild);
                        index = indexLeftChild;
                        continue;
                    }
                }
            }
            if (indexLeftChild <= data.size()-2 && data.get(index).value > data.get(indexLeftChild).value) {
                swap(index,indexLeftChild);
                index = indexLeftChild;
                continue;
            }
            if (indexRightChild <= data.size()-2 && data.get(index).value > data.get(indexRightChild).value) {
                swap(index,indexRightChild);
                index = indexRightChild;
                continue;
            }
            break;
        }
        PointOfPriorityQueue returnValue = data.get(data.size()-1);
        data.remove(data.size()-1);
        return returnValue;
    }
}
