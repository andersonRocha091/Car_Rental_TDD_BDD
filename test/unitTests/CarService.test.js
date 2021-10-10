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
describe("CarService Suite Tests", () => {
  let carService = {};
  let sandBox = {};
  before(() => {
    carService = new CarService({ cars: carDatabase });
  });

  beforeEach(() => {
    sandBox = sinon.createSandbox();
  });

  afterEach(() => {
    sandBox.restore();
  });

  it("Should retrieve a random position from an array", () => {
    const data = [1, 2, 3, 4];
    const result = carService.getRandonPositionFromArray(data);

    expect(result).to.be.lte(data.length).and.be.gte(0);
  });

  it("Should choose the first id from carIds in carCategory", () => {
    const carCategory = mocks.validCarCategory;
    const carIdIndex = 0;

    sandBox
      .stub(carService, carService.getRandonPositionFromArray.name)
      .returns(carIdIndex);

    const result = carService.choseRandomCar(carCategory);
    const expected = carCategory.carIds[carIdIndex];
    expect(carService.getRandonPositionFromArray.calledOnce).to.be.ok;
    expect(result).to.be.equal(expected);
  });
  it("given a car category it should return an available car", async () => {
    const car = mocks.validCar;
    // This prevents changing the object and jeopardizing the who test
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.carIds = [car.id];

    sandBox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car);

    sandBox.spy(carService, carService.choseRandomCar.name);
    const result = await carService.getAvailableCar(carCategory);
    const expected = car;

    expect(carService.choseRandomCar.calledOnce).to.be.ok;
    expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok;
    expect(result).to.be.deep.equal(expected);
  });
  it("given a carCategory, customer, and numberOfDays get a proper final price", () => {
    const customer = Object.create(mocks.validCustomer);
    customer.age = 50;

    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.price = 37.6;

    const numberOfDays = 5;
    // Age 50 - 1.3 tax - category price 37.6
    // 37.6 *1.3  = 48.8 * 5 days = 244.40

    // Avoiding changes on Tax class breaking the whole test
    sandBox
      .stub(carService, "taxesBasedOnAge")
      .get(() => [{ from: 40, to: 50, then: 1.3 }]);

    const expected = carService.currencyFormat.format(244.4);
    const result = carService.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays
    );
    expect(result).to.be.deep.equal(expected);
  });
  it("given a customer and a car category it should return a transaction receipt", async () => {
    const car = mocks.validCar;
    const carCategory = {
      ...mocks.validCarCategory,
      price: 37.6,
      carIds: [car.id]
    }
    const customer = Object.create(mocks.validCustomer);
    customer.age = 20;

    const numberOfDays = 5;
    const dueDate = "1 de outubro de 2021";
    
    //Assures we are always using the data 26/09/2021
    const now = new Date(2021, 8, 26);
    sandBox.useFakeTimers(now.getTime());
    sandBox.stub(carService.carRepository, carService.carRepository.find.name)
    .resolves(car);
    //age 20 - tax 1.1 - category 37.6
    // 36.6 * 1.1 = 41.36 * 5 = 206.8
    const expectedAmmount = carService.currencyFormat.format(206.80);
    const result = await carService.rent(
      customer, carCategory, numberOfDays
    );
    const expected = new Transaction({
      customer,
      car,
      ammount: expectedAmmount,
      dueDate
    });

    expect(result).to.be.deep.equal(expected);
  });
});
