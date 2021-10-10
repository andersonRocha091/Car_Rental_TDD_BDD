const http = require('http');
const { join } = require('path')

const CarService = require('./service/CarService');
const CustomerService = require('./service/CustomerService');
const CarCategoryService = require('./service/CarCategoryService');
const carDatabase = join(__dirname, "./../database", "cars.json");
const customersDatabase = join(__dirname, "./../database", "customers.json");
const carCategoryDatabase = join(__dirname, "./../database", "carCategory.json");

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
  "/rent:get": async (request, response) => {
    const body = await bodyParser(request);
    const carService = new CarService({cars: carDatabase});
    const customerService = new CustomerService({customers: customersDatabase});
    const carCategoryService = new CarCategoryService({carCategories: carCategoryDatabase});
    try {
      const customer = await customerService.findCustomer(body.customerId);
      const carCategory = await carCategoryService.findCarCategory(body.carCategoryId);
      const result = carService.calculateFinalPrice(customer, carCategory, body.numberOfDays);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify({result: result}));
    } catch (error) {
      response.writeHead(501);
      response.write("ERROR: ", error.message);
    }
    return response.end();
  },
  '/rent:post': async (request, response) => {
    const body = await bodyParser(request);
    const carService = new CarService({cars: carDatabase});
    const carCategoryService = new CarCategoryService({carCategories: carCategoryDatabase});
    const customerService = new CustomerService({customers: customersDatabase});
    try {
      const customer = await customerService.findCustomer(body.customerId);
      const carCategory = await carCategoryService.findCarCategory(body.carCategoryId);
      const result = await carService.rent(customer, carCategory, body.numberOfDays);
      console.log('result: ', result);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(
        JSON.stringify({
          result: {
            customer: result.customer,
            car: result.car,
            ammount: result.ammount,
            dueDate: result.dueDate,
          },
        })
      );
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