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
        return await Models.CategoryModel.findOne({_id: id}).exec();
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
      let dest =  await Models.CategoryModel.findOne({_id: id}).exec();
      return dest.updateOne(dataset);
    } catch (err) {
      throw err;
    }
  },
  /*Löscht eine Kategoriedaten von der DB*/
  deleteCategory: async function(id) {
    try {
      let dest = await Models.CategoryModel.findOne({_id: id}).exec();
      console.log(dest);
      dest.deleteOne();
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
        let dest = await Models.ProductModel.findOne({productid: id}).exec();
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
    getProductsByID: async function(id){
      try {
        return await Models.ProductModel.findOne({productid: id}).exec();
      } catch (err) {
        throw err;
      }
    },
    /*Gibt alle Eigenschaftsdatensätze zu  einem Artikel zurück*/
    getAllPropertys: async function(id){
      try {
        let article = await Models.ProductModel.findOne({productid: id});
        return article.propertys;
      } catch (err) {
        throw err;
      }
    },
    /*Ändern der Menge eines Artikeldatensatzes in der Eigenschaft*/
    changePropertyAmount: async function(id, subid, amount){
      try {
        let article = await Models.ProductModel.findOne({productid: id});
        for (let property of article.propertys) {
          if (property.subid == subid) {
            property.amount = amount.amount;
            break;
          }
        }
        return article.save();
      } catch (err) {
        throw err;
      }
    },
    /*Lege einen neuen Eigeschaftsdatensatz zu einem Artikel an*/
    createProperty: async function(id, sub){
      try {
        let article = await Models.ProductModel.findOne({productid: id});
        article.propertys.push(sub);
        return await article.save();
      } catch (err) {
        throw err;
      }
    }
  }
module.exports = DBOps;
