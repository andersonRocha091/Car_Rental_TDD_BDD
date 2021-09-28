const http = require('http');
const { join } = require('path')

const CarService = require('./service/CarService');
const carDatabase = join(__dirname, "./../database", "cars.json");

const bodyParser = (request) => {
  return new Promise((resolve) => {
    let body;
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      body = body.replace('undefined','');
      resolve(JSON.parse(body));
    })
  });
};

const routes = {
  "/car/available:get": async (request, response) => {
    const carService = new CarService({cars: carDatabase});
    const body = await bodyParser(request);
    try {
      const availableCar = await carService.getAvailableCar(body);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify(availableCar));
    } catch (error) {
      response.writeHead(501);
      response.write("ERROR: ", error.message);
    }
    return response.end();
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