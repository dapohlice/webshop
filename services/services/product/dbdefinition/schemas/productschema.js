const Mongoose = require('mongoose');
const SubProductSchema = require('./subproductschema');
const CategorySchema = require('./categoryschema');

/*Datenstruktur eines Datensatzes für die Produktdatenbank*/
let PSchema = new Mongoose.Schema({
  productid:
  {
    type: Number,
    require: true,
  },
  name:
  {
    type: String,
    require: true,
  },
  description:
  {
    type: String,
    require: true
  },
  price:
  {
      type: Number,
      require: true,
  },
  state:
  {
    type: Boolean,
    require: true,
  },
  timestamp:
  {
    type: Date,
    require: true,
  },
  subproduct:
  {
    type: [SubProductSchema],
  },
  catagory:
  {
    type: [CategorySchema],
    require: true,
  }
});
module.exports = PSchema;
