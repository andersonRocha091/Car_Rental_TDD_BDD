const BaseRepository = require('../repository/base/BaseRepository');

class CustomerService {
  constructor({ customers }) {
    this.customersRepository = new BaseRepository({ file: customers });
  }

  async findCustomer(customerId){
    const customer = await this.customersRepository.find(customerId);
    return customer;
  }
}

module.exports = CustomerService;