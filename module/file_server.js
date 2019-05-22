'use strict';

var
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');

var root = path.resolve(process.argv[2] || '.');

console.log('Static root dir: ' + root);

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var filepath = path.join(root, pathname);
    fs.stat(filepath, function(err, stats) {
        if(!err) {
            console.log('200 ' + request.url);
            if(stats.isFile()) {
                response.writeHead(200, {'Content-Type': 'text/*;charset=utf-8'});
                fs.createReadStream(filepath).pipe(response);
            } else {
                var head = {'Content-Type': 'text/html;charset=utf-8'};
                fs.readdir(filepath, 'utf-8', function(err, files) {
                    if(err) {
                        response.writeHead(500, head);
                        response.end('500 Internal Server Error')
                        return;
                    }
                    response.writeHead(200, head);
                    response.write('<ul>\n');
                    response.write(`<li><span style="font-weight:bold;">total: ${files.length} files</h2></li>\n`);
                    files.forEach(function(filename) {
                        response.write(`<li><a href="/${filename}">${filename}</a></li>\n`);
                    });
                    response.end('</ul>\n');
                });
            }
        } else {
            console.log('404 ' + request.url);
            response.writeHead(404);
            response.end('404 Not Found');
        }
    });
});

server.listen(8080);
console.log('Server is running at http://localhost:8080/');
