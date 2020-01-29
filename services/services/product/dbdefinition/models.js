const Mongoose = require('mongoose');
const PSchema = require('./schemas/productschema.js');
const CSchema = require('./schemas/categoryschema.js');

const Models = {};
Models.productmodel = Mongoose.model("product", PSchema);
Models.categorymodel = Mongoose.model("category", CSchema);

module.exports = Models;
