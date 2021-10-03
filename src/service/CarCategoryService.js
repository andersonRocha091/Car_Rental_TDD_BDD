const BaseRepository = require("../repository/base/BaseRepository");

class CarCategoryService {
  constructor({ carCategories}){
    this.carCategoryRepository = new BaseRepository({ file: carCategories });
  }

  async findCarCategory(carCategoryId){
    const carCategory = await this.carCategoryRepository.find(carCategoryId);
    return carCategory;
  }
}
module.exports = CarCategoryService;
