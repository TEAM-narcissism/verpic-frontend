const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(

    createProxyMiddleware(
      "/api", {
      target: "http://spring:8080/",
      changeOrigin: true,
    })
  );
  app.use(
    "/ws-stomp",
    createProxyMiddleware({
      target: "http://spring:8080/",
      ws: true,
    })
  );
};
