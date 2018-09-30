
const url = require("url");
const http = require('http');


function start(route, routeSocket, handle) {
	function onRequest(request, response) {
		let pathname = url.parse(request.url).pathname;
		request.setEncoding("utf8");
		// route request
		route(handle, pathname, response);
	}

	function onConnect(socket) {
		//console.log('Client is connected!');
		routeSocket (handle, 'connect', socket);

	}

	//create http server
	let server = http.createServer(onRequest);

	//create socket server
	let io = require('socket.io').listen(server, {
		path: '/socket.io',
		serveClient: true,
		pingInterval: 10000,
		pingTimeout: 5000,
		cookie: false
	});
	io.sockets.on('connection', onConnect);
	/*io.sockets.on('connection', function (socket) {
		console.log('Client is connected!');
		// send last 10 lines from activity file
		const readLastLines = require('read-last-lines');
		readLastLines.read('./activities/today.log', 10).then((lines) => socket.emit('message', lines));
	});*/

	server.listen(8888);
	console.log("Server has started.");
}
exports.start = start;