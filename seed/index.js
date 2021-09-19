const faker = require('faker');
const { join } = require('path');
const { writeFile } = require('fs/promises');

const Car = require('../src/entities/Car');
const CarCategory = require('../src/entities/CarCategory');
const Customer = require('../src/entities/Customer');
const ITENS_AMMOUNT = 2;
// undepending from where you run it, it will always send the output to database
const seederBaseFolder = join(__dirname, "../", "database");

const carCategory = new CarCategory({
  id: faker.datatype.uuid(),
  name: faker.vehicle.type(),
  carIds: [],
  price: faker.finance.amount(20, 100)
})
const cars = [];
const customers = [];
for (let index = 0; index <= ITENS_AMMOUNT; index++) {
  const car = new Car({
    id: faker.datatype.uuid(),
    name: faker.vehicle.model(),
    available: true,
    gasAvailable: true,
    releaseYear: faker.date.past().getFullYear()
  })
  carCategory.carIds.push(car.id);
  cars.push(car);

  const customer = new Customer({
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    age: faker.datatype.number({min: 18, max: 50})
  });
  customers.push(customer);
}
const write = (fileName, data) => writeFile(join(seederBaseFolder, fileName), JSON.stringify(data));
;(async () => {
  await write('cars.json', cars);
  await write('carCategory.json', [carCategory]);
  await write('customers.json', customers);
  console.log('cars: ', cars);
  console.log('carCategory: ', carCategory);
  console.log('customers: ', customers);
})()