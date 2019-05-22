'use strict';

var s = 'Hello';

function greet(name) {
    console.log(s + ', ' + name + '!');
}

//export default greet;
module.exports = greet; // 将函数greet作为模块的输出暴露出去，这样其他模块就可以使用greet函数了

// 模块名就是文件名（去掉.js后缀）