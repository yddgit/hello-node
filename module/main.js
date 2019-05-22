'use strict';

// 引入greet模块
//import greet from './greet';
var greet = require('./greet'); // 注意相对目录，如果只写模块名greet，Node会依次在内置模块、全局模块和当前模块下查找greet.js
var s = 'Alex';
greet(s);