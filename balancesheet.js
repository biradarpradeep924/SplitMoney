const Expense = require('./models/Expense.js');
const Person = require('./models/login.js');

const getUserBalanceSheetByName = async (personName) => {
  const person = await Person.findOne({ name: personName });

  if (!person) {
    throw new Error('Person not found');
  }

  const personIdStr = person._id.toString();

  const expenses = await Expense.find({ 

    $or: [
      { paidBy: person._id },
      { "shares.person": person._id }
    ]
  });

  let toReceive = 0;
  let toPay = 0;

  expenses.forEach(exp => {
    const isPayer = exp.paidBy.toString() === personIdStr;

    exp.shares.forEach(share => {
      const sharePersonStr = share.person.toString();

      if (sharePersonStr === personIdStr && !isPayer) {
        toPay += share.amount;
      } else if (isPayer && sharePersonStr !== personIdStr) {
        toReceive += share.amount;
      }
    });
  });

  const netBalance = toReceive - toPay;

  return {
    name: person.name,
    toPay,
    toReceive,
    netBalance
  };
};

module.exports = getUserBalanceSheetByName;
