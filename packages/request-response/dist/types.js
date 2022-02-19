"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = exports.commonHeaders = void 0;
exports.commonHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, PATCH, DELETE,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
    "cache-control": "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
    "content-type": "application/json; charset=utf8",
};
// There is probably a better place for this
function Route(_options) {
    return () => {
        return;
    };
}
exports.Route = Route;
