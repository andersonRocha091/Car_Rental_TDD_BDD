const BaseRepository = require("../repository/base/BaseRepository");
class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });
  }

  test() {
    return this.carRepository.find();
  }
}

module.exports = CarService;