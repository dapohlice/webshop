const BParser = require('body-parser');
const Express = require('express');
const Assistant = require('../database/QueryAssistant.js');
const CategoryRoute = Express.Router();

CategoryRoute.use(BParser.json());
/*POST-Request zum anlegen eines neue Kategoriedatensatzes*/
CategoryRoute.post("/", async function(req,res)
{
  try {
    let result =  await Assistant.Category.createCategory(req.body);
    res.status(201).send(result);
  } catch (err) {
    let result = await ErrorHandler.StdHandler.checkError(err);
    res.status(result.statuscode).send(result);
  }
});

/*PUT-Request zum bearbeiten eines Kategoriedatensatzes*/
CategoryRoute.put("/:id", async function(req,res)
{
  try {
    let result = await Assistant.Category.updateCategory(req.params.id, req.body);
    res.status(200).send(result);
  } catch (err) {
    let result = await ErrorHandler.StdHandler.checkError(err);
    res.status(result.statuscode).send(result);
  }
});

/*DELETE-Request zum löschen eines Kategoriedatensatzes*/
CategoryRoute.delete("/:id", async function (req,res)
{
  try {
    let result = Assistant.Category.deleteCategory(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    let result = await ErrorHandler.StdHandler.checkError(err);
    res.status(result.statuscode).send(result);
  }
});

/*GET-Request zum ausgeben aller Kategoriedatensätz*/
CategoryRoute.get("/", async function(req,res)
{
  try {
    let result = await Assistant.Category.getAllCategorys();
    res.status(200).send(result);
  } catch (err) {
    let result = await ErrorHandler.StdHandler.checkError(err);
    res.status(result.statuscode).send(result);
  }
});

/*GET-Request zum finden eines Kategoriedatensatzes*/
CategoryRoute.get("/:id", async function(req,res)
{
  try {
    let result = await Assistant.Category.getCategoryByID(req.params.id)
    res.status(200).send(result);
  } catch (err) {
    let result = await ErrorHandler.StdHandler.checkError(err);
    res.status(result.statuscode).send(result);
  }
});

module.exports = CategoryRoute;
