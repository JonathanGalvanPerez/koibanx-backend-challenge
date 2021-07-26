const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  id: String,
  name: String,
  cuit: String,
  concepts: Array,
  currentBalance: Number,
  active: Boolean,
  lastSale: Date,
},{ timestamps: true });

StoreSchema.pre('save', async function (callback) {
  this.id = this._id.toString();
  return callback();
});

module.exports = mongoose.model('Store', StoreSchema);
