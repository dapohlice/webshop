const Mongoose = require('mongoose');
const PSchema = require('./schemas/ProductSchema.js');
const CSchema = require('./schemas/CategorySchema.js');

const Models = {};
Models.ProductModel = Mongoose.model("article", PSchema);
Models.CategoryModel = Mongoose.model("category", CSchema);

module.exports = Models;
