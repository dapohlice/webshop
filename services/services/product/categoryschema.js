const Mongoose = require('mongoose');
let cschema = new Mongoose.Schema({
categoryname:
{
  type: String,
  require: true,
},
picturepath:
{
  type: String,
  require: true,
},

/*Aus dem Scheman ein Model bauen.
  dieses Model ist die Grundlage der Collection "category"*/
});
let cmodel = Mongoose.model("category", cschema);
module.exports = cmodel;
