const BaseRepository = require("../repository/base/BaseRepository");
class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });
  }

  getAvailableCar(carCategory) {
    return null;
  }
}

module.exports = CarService;
