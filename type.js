'use strict';

class Type {
    constructor() {
        // let _this = this;
        this.newType = getRandomNum(1, tetroTypes.length);
        this.nowType = this.newType;
    }

    getNewType = () => {
        return this.newType;
    }

    getNowType = () => {
        return this.nowType;
    }
}