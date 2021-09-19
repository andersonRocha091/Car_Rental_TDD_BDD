const Base = require('./Base');
class CarCategory extends Base {
  constructor({ id, name, carIds, price}) {
    super({ id, name });
    this.carIds = carIds;
    this.prince = price;
  }
}
module.exports = CarCategory;