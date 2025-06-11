const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  paidBy: { type: String, required: true },
  description: String,
  peopleInvolved: [{ type: String, required: true }],
  splitDetails: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
