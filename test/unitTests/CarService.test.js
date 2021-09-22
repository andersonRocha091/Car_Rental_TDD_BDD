const { describe, it, before } = require("mocha");
const assert = require('assert');
const { join } = require("path");


const CarService = require('../../src/service/CarService');
// it normalizes the file path
const carDatabase = join(__dirname,'./../../database', 'cars.json');
const mocks = {
  validCar: require('../mocks/valid-car.json'),
  validCarCategory: require('../mocks/valid-carCategory.json'),
  validCustomer: require('../mocks/valid-costumer.json'),
}
describe('CarService Suite Tests', () => {
  let carService = {};
  before(() => {
    carService = new CarService({ cars: carDatabase});
  })
  it('given a car category it should return an available car', async () => {
    const result = await carService.getAvailableCar();
    const expected = {};
    assert.deepStrictEqual(result, expected);
  });
});