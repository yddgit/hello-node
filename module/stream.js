'use strict'

var fs = require('fs');

// 创建read流
var rs = fs.createReadStream('sample.txt', 'utf-8');

// 响应流事件

// data事件表示流的数据可以读取了，可能会有多次，每次传递的chunk是流的一部分数据
rs.on('data', function(chunk) {
    console.log('DATA');
    console.log(chunk);
});
// end事件表示这个流已经到末尾了，没有数据可以读取了
rs.on('end', function() {
    console.log('END');
});
// error事件表示出错了
rs.on('error', function(err) {
    console.log('ERROR' + err)
});

// 创建write流
// 不断调用write()方法，最后以end()结束
var ws1 = fs.createWriteStream('output1.txt', 'utf-8');
ws1.write('使用Stream写入文本数据...\n');
ws1.write('END');
ws1.end();
var ws2 = fs.createWriteStream('output2.txt');
ws2.write(new Buffer('使用Stream写入二进制数据...\n', 'utf-8'));
ws2.write(new Buffer('END', 'utf-8'));
ws2.end();

// 所有读取数据的流都继承自stream.Readable，所有可以写入的流都继承自stream.Writable

// 两个流可以串起来，数据自动从Readable流进入Writable流，这个操作可以用Readable中的pipe()方法实现
// 如：复制一个文件
var rs = fs.createReadStream('sample.txt');
var ws = fs.createWriteStream('copied.txt');
rs.pipe(ws);

// 默认情况下，当Readable流的数据读取完毕，end事件触发后，将自动关闭Writable流
// 如果不希望自动关闭Writable流，需要传入参数
//rs.pipe(ws, {end: false});
