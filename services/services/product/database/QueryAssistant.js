const DBConnection = require('./DBConnection.js');
const Models = require('./Models.js');

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
        let article = new Models.ProductModel(dataset);
        return await article.save();
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
          throw {name: 'NotFound'};
        }
        return dest.updateOne(dataset);
      } catch (err) {
        throw err;
      }
    },
    /*Ändern des Status eines Produktdatensatzes*/
    changeState: async function(id, state){
      try {
        let dest =  await Models.ProductModel.findOne({productid: id}).exec();
        if (dest == null) {
          throw {name: 'NotFound'};
        }
        return dest.updateOne({state: state});
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
          throw {name: 'NotFound'};
        }
        return dest;
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
        if(!article){
          throw {name: 'NotFound'};
        }
        let check = false;
        for (let property of article.propertys) {
          if (property.subid == subid) {
            property.amount += amount.amount;
            check = true;
            break;
          }
          if(check == false){
            throw {name: 'NotFound'};
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
        if (article) {
          if (Array.isArray(sub)) {
            for(let property of sub){
              article.propertys.push(property);
            }
          }
          else {
            article.propertys.push(sub);
          }
          return await article.save();
        }
        else {
          throw {name: 'NotFound'};
        }
      } catch (err) {
        throw err;
      }
    }
  }
module.exports = DBOps;
