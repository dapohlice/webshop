const Mongoose = require('mongoose');
const PropertySchema = require('./PropertySchema');
const CategorySchema = require('./CategorySchema');

/*Datenstruktur eines Datensatzes für die Produktdatenbank*/
let PSchema = new Mongoose.Schema({
  productid: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  state: { type: Boolean, required: true },
  timestamp: { type: Date, require: true },
  propertys: { type: [PropertySchema] },
  catagory: { type: String, require: true }
});
module.exports = PSchema;
