class Transaction {
  constructor({ customer, car, ammount, dueDate}){
    this.customer = customer;
    this.car = car;
    this.ammount = ammount;
    this.dueDate = dueDate;
  }
}

module.exports = Transaction;