let Stack = cc.Class.extend({
    ctor: function () {
        this.data = [];
    },

    // add element to the stack
    add: function (element) {
        return this.data.push(element);
    },

    // remove element from the stack
    pop: function () {
        if(this.data.length > 0) {
            return this.data.pop();
        }
    },

    // view the last element
    top: function () {
        return this.data[this.data.length - 1];
    },

    // check if the stack is empty
    isEmpty: function (){
        return this.data.length === 0;
    },

    // the size of the stack
    size: function (){
        return this.data.length;
    },

    // empty the stack
    clear: function (){
        this.data = [];
    }
})