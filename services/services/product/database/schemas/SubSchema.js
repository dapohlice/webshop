const Mongoose = require('mongoose');
/*Datenstruktur eines Datensatzes für einen Produktkategoriedatensatz*/
let spschema = new Mongoose.Schema({
  subid: { type: Number, required: true, },
  property: { type: String, required: true,},
  amount: { type: Number, required: true, default: 0, }
});
module.exports = spschema;
