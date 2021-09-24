const { describe, it, before, beforeEach, afterEach } = require("mocha");
const { expect } = require('chai');
const sinon = require('sinon');
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
  let sandBox = {};
  before(() => {
    carService = new CarService({ cars: carDatabase});
  });

  beforeEach(() => {
    sandBox = sinon.createSandbox();
  });

  afterEach(() => {
    sandBox.restore();
  });

  it('Should retrieve a random position from an array', () => {
    const data = [1,2,3,4];
    const result = carService.getRandonPositionFromArray(data);

    expect(result).to.be.lte(data.length).and.be.gte(0);
  });

  it('Should choose the first id from carIds in carCategory', () => {
    const carCategory = mocks.validCarCategory;
    const carIdIndex = 0;

    sandBox.stub(
      carService,
      carService.getRandonPositionFromArray.name
    ).returns(carIdIndex);

    const result = carService.choseRandomCar(carCategory);
    const expected = carCategory.carIds[carIdIndex];
    expect(carService.getRandonPositionFromArray.calledOnce).to.be.ok;
    expect(result).to.be.equal(expected);
  });
  // it('given a car category it should return an available car', async () => {
  //   const car = mocks.validCar;
  //   // This prevents changing the object and jeopardizing the who test
  //   const carCategory = Object.create(mocks.validCarCategory);
  //   carCategory.ids = [car.id];
  //   const result = await carService.getAvailableCar(carCategory);
  //   const expected = car;

  //   expect(result).to.be.deep.equal(expected);
  // });
});