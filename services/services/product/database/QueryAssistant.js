const Mongoose = require('mongoose');
const DBConnection = require('./DBConnection.js');
const Models = require('./Models.js');

const connection = new DBConnection();

const DBOps = {};
  DBOps.Category = {
    /*Erstellt neuen Kategoriedatensatz*/
    createCategory: async function(dataset){
      try {
        let category = new Models.CategoryModel(dataset);
        return await category.save();
      } catch (err) {
        throw err;
      }
    },
    /*Selektiere Kategorie durch ID ->  ID ist die erzeugte ID der MongoDB*/
    getCategoryByID: async function(id){
      try {
        return await Models.CategoryModel.findById({_id: id}).exec();
      } catch (err) {
        throw err;
      }
    },
    /*Selektiere alle Kategoriedatensätze*/
    getAllCategorys: async function(){
        try {
          return await Models.CategoryModel.find().exec();
        } catch (err) {
          throw err;
        }
    },

  /*Kategoriedatensatz bearbeiten*/
  updateCategory: async function(id, dataset) {
    try {
      let opt = {runValidators: true};
      let result =  await Models.CategoryModel.findByIdAndUpdate(id, dataset, opt);
      return result.exec();
    } catch (err) {
      throw err;
    }
  },
  /*Löscht eine Kategoriedaten von der DB*/
  deleteCategory: async function(id) {
    try {
      return await Models.CategoryModel.findByIdAndDelete(id);
    } catch (err) {
      throw err;
    }
  }
}
  DBOps.Product = {
    /*Erstellen einen neuen Produktdatensatzes*/
    createProduct: async function(dataset) {
      try {
        let article = new Models.ProductModel(dataset);
        return await article.save();
      } catch (err) {
        throw err;
      }
    },
    /*Ändern eines Produktdatensatzes*/
    updateProduct: async function(id, dataset){
      try {
        dest = await Models.ProductModel.find({productid: id}).exec();
        dest.set(dataset);
        return await dest.save();
      } catch (err) {
        throw err;
      }
    },
    /*Ändern des Status eines Produktdatensatzes*/
    changeState: async function(id, state){
      try {
        let dest = await Models.ProductModel.find({productid: id}).exec();
        dest.set({state: state});
        return await dest.save();
      } catch (err) {
        throw err;
      }
    },
    /*Selektieren alle Produktdatensätze*/
    getAllProducts: async function(){
        try {
          return await Models.ProductModel.find().exec();
        } catch (err) {
          throw err;
        }
      },
      /*Finde Produkt über seine ID -> ID ist Produktid*/
      getProductsBy: async function(id){
        try {
          return Models.ProductModel.find({productid: id});
        } catch (err) {
          throw err;
        }
      }
  }
module.exports = DBOps;
