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
});
