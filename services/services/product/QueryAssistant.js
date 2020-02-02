const Mongoose = require('mongoose');
const DBConnection = require('./dbconnection.js');
const Models = require('./dbdefinition/models.js');

const connection = new DBConnection();

const DBOps = {};
  DBOps.Category =
  {
    /*Erstellt neuen Kategoriedatensatz*/
    createCategory: async function(dataset)
    {
      try
      {
        let category = new Models.CategoryModel(dataset);
        return await category.save();
      }
      catch (err)
      {
        throw err;
      }
    },
    /*Selektiere Kategorie durch ID ->  ID ist die erzeugte ID der MongoDB*/
    getCategoryByID: async function(id)
    {
      try
      {
        return await Models.CategoryModel.findById({_id: id}).exec();
      }
      catch (err)
      {
        throw err;
      }
    },
    /*Selektiere alle Kategoriedatensätze*/
    getAll: async function()
    {
        try
        {
          return await Models.CategoryModel.find().exec();
        }
        catch (err)
        {
          throw err;
        }
    },

  /*Kategoriedatensatz bearbeiten*/
  updateCategory: async function(id, dataset)
  {
    try
    {
      let opt = {runValidators: true};
      let result =  await Models.CategoryModel.findByIdAndUpdate(id, dataset, opt);
      return result.exec();
    }
    catch (err)
    {
      throw err;
    }
  },
  /*Löscht eine Kategoriedaten von der DB*/
  deleteCategory: async function(id)
  {
    try
    {
      return await Models.CategoryModel.findByIdAndDelete(id);
    }
    catch (err)
    {
      throw err;
    }
  }
}
module.exports = DBOps;
