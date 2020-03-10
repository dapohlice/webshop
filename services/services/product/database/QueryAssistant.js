const DBConnection = require('./DBConnection.js');
const Models = require('./Models.js');
const Errors = require('../Exceptions/AllOwnErrors.js');

const connection = new DBConnection();

const DBOps = {};
  DBOps.Helper = {
    removeEmptyFieldsInJSON: function (dataobj) {
    for (let field in dataobj) {
        if (dataobj[field] === null || dataobj[field] === "" ) {
          delete dataobj[field];
        }
      }
    }
  }
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
      await DBOps.Helper.removeEmptyFieldsInJSON(dataset);
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
        let pid = dataset.productid;
        if (Number.isInteger(pid)) {
          return await new Models.ProductModel(dataset).save();
        }
        else {
          let msg = "Value is not an Integer!";
          let at = "ProductID";
          throw new Errors.WrongTypeError(msg,at);
        }
      } catch (err) {
        throw err;
      }
    },
    /*Ändern eines Produktdatensatzes*/
    updateProduct: async function(id, dataset){
      try {
        await DBOps.Helper.removeEmptyFieldsInJSON(dataset);
        let dest =  await Models.ProductModel.findOne({productid: id}).exec();
        if (dest == null) {
          let msg = "Document not Found!";
          let searched = "ProductID: " + id;
          throw new Errors.NotFoundError(msg, searched);
        }
        return dest.updateOne(dataset);
      } catch (err) {
        throw err;
      }
    },
    /*Ändern des Status eines Produktdatensatzes*/
    changeState: async function(id, state){
      try {
        search = {productid: id};
        state  = {state: state};
        opt    = {new: true};
        let dest = await Models.ProductModel.findOneAndUpdate(search, state, opt);
        if (dest == null) {
          let msg = "Document not Found!";
          let searched = "ProductID: " + id;
          throw new Errors.NotFoundError(msg, searched);
        }
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
    /*Selektieren aller aktiven Produktdatensätze*/
    getAllActiveProducts: async function(){
      try {
        return await Models.ProductModel.find({state: true}).exec();
      } catch (err) {
        throw err;
      }
    },
    /*Finde Produkt über seine ID -> ID ist Produktid*/
    getProductByID: async function(id){
      try {
        let dest = await Models.ProductModel.findOne({productid: id}).exec();
        if (dest == null) {
          let msg = "Document not Found!";
          let searched = "ProductID: " + id;
          throw new Errors.NotFoundError(msg, searched);
        }
        return dest;
      } catch (err) {
        throw err;
      }
    },
    /*Gibt alle Eigenschaftsdatensätze zu einem Artikel zurück*/
    getAllPropertys: async function(id){
      try {
        let article = await Models.ProductModel.findOne({productid: id});
        if (article == null) {
          let msg = "Document not Found!";
          let searched = "ProductID: " + id;
          throw new Errors.NotFoundError(msg, searched);
        }
        return article.propertys;
      } catch (err) {
        throw err;
      }
    },
    /*Ändern der Menge eines Artikeldatensatzes in der Eigenschaft*/
    changePropertyAmount: async function(id, subid, amount){
      try {
        let article = await Models.ProductModel.findOne({productid: id});
        if(article == null){
          let msg = "Document not Found!";
          let searched = "ProductID: " + id;
          throw new Errors.NotFoundError(msg, searched);
        }
        else {
          let check = false;
          for (let property of article.propertys) {
            if (property.subid == subid) {
              console.log(property.amount >= !amount);
              if (property.amount >= !amount) {
                throw new Errors.NotEnoughItemsError(property.amount);
              }
              property.amount += amount.amount;
              check = true;
              break;
            }
            if(check == false){
              let msg = "Property not Found!";
              let searched = "PropertyID: " + subid;
              throw new Errors.NotFoundError(msg, searched);
            }
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
        search = {productid: id};
        create = {$addToSet: {propertys: sub}};
        opt    = {new: true};
        let dest = await Models.ProductModel.findOneAndUpdate(search, create, opt);
        if (dest == null) {
          let msg = "Document not Found!";
          let searched = "ProductID: " + id;
          throw new Errors.NotFoundError(msg, searched);
        }
        return dest;
      } catch (err) {
        throw err;
      }
    },

    /*Bearbeiten einen Eigenschaftsdatensatz*/
    updateProperty: async function(id, subid, subset){
      try {
        opt = {new: true};
        let dest = await Models.ProductModel.findOneAndUpdate({productid: id, "propertys.subid": subid},
                                                              {
                                                                "$set":{"propertys.$": subset}
                                                              },opt);
        if (dest == null) {
          let msg = "Document not Found!";
          let searched = "ProductID: " + id + " SubID: " + subid;
          throw new Errors.NotFoundError(msg, searched);
        }
          return dest;
      } catch (err) {
        throw err;
      }
    }
  }
module.exports = DBOps;
