const Mongoose = require('mongoose');
const SubProductSchema = require('./subproductschema');
/*Datenstruktur eines Datensatzes für die Produktdatenbank*/
let pschema = new Mongoose.Schema({
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
  catagory:
  {
    type: String,
    require: true,
  }
});
/*Aus dem Schema eine Model bauen
  diese Model dient als Grundlage für eine Collection*/
let pmodel = Mongoose.model("product", pschema);
module.exports = pmodel;
