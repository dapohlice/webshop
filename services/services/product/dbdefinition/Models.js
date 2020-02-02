const Mongoose = require('mongoose');
const PSchema = require('./schemas/productschema.js');
const CSchema = require('./schemas/categoryschema.js');

const Models = {};
Models.ProductModel = Mongoose.model("article", PSchema);
Models.CategoryModel = Mongoose.model("category", CSchema);

module.exports = Models;
