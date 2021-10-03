const { describe, it, before, beforeEach, afterEach } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const { join } = require("path");

const CarCategoryService = require("../../src/service/CarCategoryService");
const carCategoryDatabase = join(__dirname, "./../../database", "carCategory.json");

const mocks = {
  validCarCategory: require("../mocks/valid-carCategory.json"),
};

describe('CarCategoryService tests suite', () => {
  let carCategoryService = {};
  let sandBox = {};
  before(() => {
    carCategoryService = new CarCategoryService({ carCategories: carCategoryDatabase });
  });

  beforeEach(() => {
    sandBox = sinon.createSandbox();
  });

  afterEach(() => {
    sandBox.restore();
  });
  it('Should get a carCategory by id', async () => {
    const carCategory = mocks.validCarCategory;
    console.log('carCategoryService.carCategoryRepository: ', carCategoryService.carCategoryRepository.find);
    sandBox.stub(carCategoryService.carCategoryRepository, carCategoryService.carCategoryRepository.find.name)
    .resolves(carCategory);
    sandBox.spy(carCategoryService, carCategoryService.findCarCategory.name);
    const result = await carCategoryService.findCarCategory(carCategory.id);
    expect(carCategoryService.carCategoryRepository.find.calledWithExactly(carCategory.id)).to.be.ok;
    expect(result).to.be.deep.equal(carCategory);
  });
});