const { describe, it, before, beforeEach, afterEach } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const { join } = require("path");

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
  it("Should get an available car", () => {
    
  });
});