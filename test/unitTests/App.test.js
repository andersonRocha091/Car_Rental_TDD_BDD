const { describe, it, before, beforeEach, afterEach } = require("mocha");
const { expect, assert } = require("chai");
const sinon = require("sinon");
const { join } = require("path");
const request = require("supertest");

const app = require("../../src/App");
const CarService = require("../../src/service/CarService");
const CarCategoryService = require("../../src/service/CarCategoryService");
const CustomerService = require("../../src/service/CustomerService");
// it normalizes the file path
const carDatabase = join(__dirname, "./../../database", "cars.json");
const customersDatabase = join(__dirname, "./../../database", "customers.json");
const carCategoryDatabase = join(__dirname, "./../../database", "carCategory.json");

const mocks = {
  validCar: require("../mocks/valid-car.json"),
  validCarCategory: require("../mocks/valid-carCategory.json"),
  validCustomer: require("../mocks/valid-costumer.json"),
};

describe("Suite tests of presentation layer api", () => {
  let sandBox = {};
  let carCategoryService = {};
  let carService = {};
  let customerService = {};
  before(() => {
    carCategoryService = new CarCategoryService({ carCategories: carCategoryDatabase });
    customerService = new CustomerService({customers: customersDatabase});
    carService = new CarService({cars: carDatabase});
  });

  beforeEach(() => {
    sandBox = sinon.createSandbox();
  });

  afterEach(() => {
    sandBox.restore();
  });

  it("Should return an error 501 for a invalid url", async () => {
    const { status, text } = await request(app).get("/car/avai");
    expect(status).to.be.equals(501);
    expect(text).to.be.equals("Specify a valid url");
  });
  it("Should get an available car", async () => {
    const { status, body } = await request(app)
      .get("/car/available")
      .send({ ...mocks.validCarCategory });
    expect(status).to.be.equals(200);
    expect(body.available).to.be.ok;
  });
  it("Should get final value for the rental", async () => {
    const { status, body } = await request(app)
      .get("/rent")
      .send({
        carCategoryId: mocks.validCarCategory.id,
        customerId: mocks.validCustomer.id,
        numberOfDays: 5,
      });
    const finalPrice = body.result.replace(/\D/g, "");
    expect(finalPrice).to.be.equals('26806');
    expect(status).to.be.equals(200);
  });
  it("Should rent a car and get back a transaction", async () => {
    const car = mocks.validCar;
    const customer = {
      ...mocks.validCustomer,
      age: 50
    };
    // This prevents changing the object and jeopardizing the who test
    const carCategory ={
      ...mocks.validCarCategory,
      carIds: [car.id],
      price: 36.7
    }
    sandBox.stub(customerService.customersRepository, customerService.customersRepository.find.name)
    .resolves(customer);
    sandBox.stub(carCategoryService.carCategoryRepository, carCategoryService.carCategoryRepository.find.name)
    .resolves(carCategory);
    sandBox.stub(carService.carRepository, carService.carRepository.find.name)
    .resolves(car);
    const dueDate = "10 de outubro de 2021";
    //Assures we are always using the data 26/09/2021
    const now = new Date(2021, 9, 5);
    sandBox.useFakeTimers(now.getTime());
    const { status, body } = await request(app)
    .post("/rent")
    .send({
      carCategoryId: mocks.validCarCategory.id,
      customerId: mocks.validCustomer.id,
      numberOfDays: 5,
    });
    console.log('body: ', body);
    expect(status).to.be.equals(200);
    const finalPrice = body.result.ammount.replace(/\D/g, "");
    expect(finalPrice).to.be.equals('26806');
  })
});
