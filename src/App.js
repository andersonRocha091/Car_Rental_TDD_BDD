const http = require('http');

const CarService = require('./service/CarService');

const routes = {
  "/car/available:get": async (request, repsonse) => {

  },
  default: (request, response) => {
    response.writeHead(501);
    response.write("Specify a valid url");
    return response.end();
  }
};

const handler = (request, response) => {
  const { url, method } = request;
  const routeKey = `${url}:${method.toLowerCase()}`;
  const chosen = routes[routeKey] || routes.default;
  response.writeHead(200, {
    "Content-Type": "application/json",
  });
  return chosen(request, response);
}

const app = http
  .createServer(handler)
  .listen(3000, () => console.log("app running at: ", 3000));

module.exports = app;