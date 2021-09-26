const BaseRepository = require("../repository/base/BaseRepository");
const Tax = require('../entities/Tax');
class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });
    this.taxesBasedOnAge = Tax.taxesBasedOnAge;
    this.currencyFormat = new Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }

  async getAvailableCar(carCategory) {
    const carId = this.choseRandomCar(carCategory);
    const car = await this.carRepository.find(carId);
    return car;
  }
  getRandonPositionFromArray(list) {
    const listLength = list.length;
    return Math.floor(Math.random() * listLength);
  }
  choseRandomCar(carCategory) {
    const randomCarIndex = this.getRandonPositionFromArray(carCategory.carIds);
    const carId = carCategory.carIds[randomCarIndex];
    return carId;
  }

  async calculateFinalPrice(customer, carCategory, numberOfDays) {
    const { age } = customer;
    const { price } = carCategory;
    const { then: tax } = this.taxesBasedOnAge.find(
      (tax) => age >= tax.from && age <= tax.to
    );

    const finalPrice = tax * price * numberOfDays;
    const formattedPrice = this.currencyFormat.format(finalPrice);
    return formattedPrice;
  }
}

module.exports = CarService;
