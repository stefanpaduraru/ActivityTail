var querystring = require("querystring");
var fs = require('fs');
var connections = []
const readLastLines = require('read-last-lines');

function start(response) {
	fs.readFile('./index.html', 'utf-8', function(error, content) {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end(content);
	});
}

function socketClientConnect(socket) {
	// get last 10 lines, reorder and send to client
	// save last line
	var address = socket.request.connection.remoteAddress
  	console.log('New ws connection from '+address);
	readLastLines.read('./activities/today.log', 10).then((lines) => {
		var al = lines.split(/[\r\n]+/).reverse();
		var ln = al[0];
		var conn = {'sock':socket, 'ln':ln}
		connections[socket.id] = conn;
		socket.emit('message', al.join('\r\n'))
	});

	// continue to push
	setInterval(
		() => socketBroadCastNext(socket),
		5000
	);
}

function socketBroadCastNext(socket) {
	var cc = connections[socket.id];
	readLastLines.read('./activities/today.log', 10).then((lines) => {
		var al = lines.split(/[\r\n]+/);
		var cnt = 0;
		for (l of al) {
			if (cc.ln === l) {
				al.splice(0, cnt+1);
				break;
			}
			cnt ++;
		}
		
		// send message only if we have new lines of code
		al = al.reverse();
		if (al.length) {
			cc.ln = al[0];
			newContent = al.join('\r\n')+'\r\n';
			socket.emit('message', newContent);
		}
	});
}

exports.start = start;
exports.socketClientConnect = socketClientConnect;
//exports.socketClientNext = socketClientNext;
