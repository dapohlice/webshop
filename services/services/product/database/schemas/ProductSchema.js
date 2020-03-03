const Mongoose = require('mongoose');
const SubSchema = require('./SubSchema');
const CategorySchema = require('./CategorySchema');

/*Datenstruktur eines Datensatzes für die Produktdatenbank*/
let PSchema = new Mongoose.Schema({
  productid: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  state: { type: Boolean, required: true },
  picturepath: {type: String, required: true},
  propertys: [SubSchema],
  categoryid: { type: Mongoose.ObjectId, required: true },
  category:{type: String, required: true}
}, {timestamps: true}
);
module.exports = PSchema;
