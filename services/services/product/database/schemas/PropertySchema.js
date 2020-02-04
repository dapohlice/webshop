const Mongoose = require('mongoose');
/*Datenstruktur eines Datensatzes für einen Produktkategoriedatensatz*/
let proschema = new Mongoose.Schema({
  subproductid: { type: Number, require: true, },
  propertys: { type: [String], default: undefined, },
  amount: { type: Number, default: 0, }
});
module.exports = proschema;
