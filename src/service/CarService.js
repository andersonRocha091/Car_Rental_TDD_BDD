const BaseRepository = require("../repository/base/BaseRepository");
class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });
  }

  getAvailableCar(carCategory) {
    const carId = this.choseRandomCar(carCategory);
    const car = this.carRepository.find(carId);
    return car;
  }
  getRandonPositionFromArray(list){
    const listLength = list.length;
    return Math.floor(
      Math.random() * (listLength)
    )
  }
  choseRandomCar(carCategory){
      const randomCarIndex = this.getRandonPositionFromArray(carCategory.carIds);
      const carId = carCategory.carIds[randomCarIndex];
      return carId
  }
}

module.exports = CarService;
