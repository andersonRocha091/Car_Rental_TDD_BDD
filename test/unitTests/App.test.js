const { describe, it, before, beforeEach, afterEach } = require("mocha");
const { expect, assert } = require("chai");
const sinon = require("sinon");
const { join } = require("path");
const request = require("supertest");

const app = require("../../src/App");
const CarService = require("../../src/service/CarService");
const Transaction = require("../../src/entities/Transaction");
// it normalizes the file path
const carDatabase = join(__dirname, "./../../database", "cars.json");
const mocks = {
  validCar: require("../mocks/valid-car.json"),
  validCarCategory: require("../mocks/valid-carCategory.json"),
  validCustomer: require("../mocks/valid-costumer.json"),
};

describe("Suite tests of presentation layer api", () => {
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
});
