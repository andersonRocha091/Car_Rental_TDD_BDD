const { describe, it, before, beforeEach, afterEach } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const { join } = require("path");

const CustomerService = require("../../src/service/CustomerService");
const customerDatabase = join(__dirname, "./../../database", "customers.json");

const mocks = {
  validCustomer: require("../mocks/valid-costumer.json"),
};

describe("Customers suite tests", () => {
  let customerService = {};
  let sandBox = {};
  before(() => {
    customerService = new CustomerService({ customers: customerDatabase });
  });

  beforeEach(() => {
    sandBox = sinon.createSandbox();
  });

  afterEach(() => {
    sandBox.restore();
  });

  it("Should return a customer by id", async () => {
    const customer = mocks.validCustomer;
    sandBox
      .stub(customerService.customersRepository, customerService.customersRepository.find.name)
      .resolves(customer);
    sandBox.spy(customerService, customerService.findCustomer.name);
    const expected = customer;
    const result = await customerService.findCustomer(customer.id);
    expect(customerService.customersRepository.find.calledWithExactly(customer.id)).to.be.ok;
    expect(result).to.be.deep.equal(expected);
  });
});