'use strict';

var http = require('http');
var url = require('url');
var path = require('path');

// url用于解析url
console.log(url.parse('http://user:password@hostname.com:8080/path/to/file?query=string#hash'));
/*
Url {
  protocol: 'http:',
  slashes: true,
  auth: 'user:password',
  host: 'hostname.com:8080',
  port: '8080',
  hostname: 'hostname.com',
  hash: '#hash',
  search: '?query=string',
  query: 'query=string',
  pathname: '/path/to/file',
  path: '/path/to/file?query=string',
  href: 'http://user:password@hostname.com:8080/path/to/file?query=string#hash' }
*/

// path用于构造处理文件目录
var workDir = path.resolve('.');
console.log(workDir);
var filePath = path.join(workDir, 'pub', 'index.html');
console.log(filePath);

// 创建http server，并传入回调函数
var server = http.createServer(function (request, response) {
    // 获得HTTP请求的method和url
    console.log(request.method + ': ' + request.url);
    // 将HTTP响应200写和response，同时设置Content-Type: text/html
    response.writeHead(200, {'Content-Type': 'text/html'});
    // 将HTTP响应的HTML内容写入response
    response.end('<h1>Hello World!</h1>');
});

// 让服务器监听8080端口
server.listen(8080);
console.log('Server is running at http://localhost:8080/');