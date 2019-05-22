'use strict';

var fs = require('fs');

// 异步读取文本文件
fs.readFile('sample.txt', 'utf-8', function(err, data) {
    console.log('=============异步读取文本文件=============');
    // 正常读取时，err参数为null，data为读取到的String
    // 读取错误时，err参数为一个错误对象，data为undefined
    // 这也是Node.js标准的回调函数：第一个参数代表错误信息，第二个参数代表结果
    if(err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

// 异步读取二进制文件
fs.readFile('sample.jpg', function(err, data) {
    console.log('=============异步读取二进制文件=============');
    if(err) {
        console.log(err);
    } else {
        // 读取二进制文件不传入编码时，回调函数的data参数将返回一个Buffer对象
        // 在Node.js中，Buffer对象就是一个包含零个或任意个字节的数组（但和Array不同）
        console.log(data);
        console.log(data.length + ' bytes');
    }
});

// 同步读取文件
var data = fs.readFileSync('sample.txt', 'utf-8');
console.log('=============同步读取文本文件=============');
console.log(data);

// 同步读取发生错误，需要用try...catch...捕获
try {
    fs.readFileSync('no-file.txt', 'utf-8');
} catch(err) {
    console.log('=============同步读取文件错误=============');
    console.log(err);
}

// 写文件
var data = 'Hello, Node.js'
// 如果data是String，默认按UTF-8编码写入，如果是Buffer，则写入的是二进制文件
// 回调函数只关心成功与否，默认只需要一个err参数
fs.writeFile('output.txt', data, function(err) {
    console.log('=============异步写文本文件=============');
    if(err) {
        console.log(err);
    } else {
        console.log('ok');
    }
});

console.log('=============同步写文本文件=============');
fs.writeFileSync('output.txt', data);

// stat获取文件大小，创建时间等信息
fs.stat('sample.txt', function(err, stat) {
    console.log('=============异步查看文件信息=============');
    if(err) {
        console.log(err);
    } else {
        console.log('isFile: ' + stat.isFile());
        console.log('isDirectory: ' + stat.isDirectory());
        if(stat.isFile()) {
            console.log('size: ' + stat.size);
            console.log('birth time: ' + stat.birthtime);
            console.log('modified time: ' + stat.mtime);
        }
    }
});

var stat = fs.statSync('sample.txt');
console.log('=============同步查看文件信息=============');
console.log(stat);
