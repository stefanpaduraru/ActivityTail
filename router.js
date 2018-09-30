function route(handle, pathname, response) {
	//console.log("About to route a request for " + pathname);
	if (typeof handle[pathname] === 'function') {
		handle[pathname](response);
	} else {
		//console.log("No request handler found for " + pathname);
		response.writeHead(404, {
			"Content-Type" : "text/plain"
		});
		response.write("404 Not found");
		response.end();
	}
}

function routeSocket(handle, operation, socket) {
	if (typeof handle[operation] === 'function') {
		handle[operation](socket);
	} else {
		//console.log("No socket handler found for " + operation);
	}
}
exports.route = route;
exports.routeSocket = routeSocket;