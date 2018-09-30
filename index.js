/**
 * Build server, router and request handlers
 * Inject router and handle dependencies
 */
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["connect"] = requestHandlers.socketClientConnect;
handle["next"] = requestHandlers.socketClientNextLine;

server.start(router.route, router.routeSocket, handle);