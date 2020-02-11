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
    res.send(result);
  } catch (err) {
    res.status(404).send(err);
  }
});

/*PUT-Request zum bearbeiten eines Kategoriedatensatzes*/
CategoryRoute.put("/:id", async function(req,res)
{
  try {
    let result = await Assistant.Category.updateCategory(req.params.id, req.body);
    res.send(result);
  } catch (err) {
    res.status(404),send(err);
  }
});

/*DELETE-Request zum löschen eines Kategoriedatensatzes*/
CategoryRoute.delete("/:id", async function (req,res)
{
  try {
    console.log(req.params.id);
    let result = Assistant.Category.deleteCategory(req.params.id);
    res.send("Erfolgreich gelöscht!");
  } catch (err) {
    res.status(404).send(err);
  }
});

/*GET-Request zum ausgeben aller Kategoriedatensätz*/
CategoryRoute.get("/", async function(req,res)
{
  try {
    let result = await Assistant.Category.getAllCategorys();
    res.send(result);
  } catch (err) {
    res.status(404).send(err);
  }
});

/*GET-Request zum finden eines Kategoriedatensatzes*/
CategoryRoute.get("/:id", async function(req,res)
{
  try {
    let result = await Assistant.Category.getCategoryByID(req.params.id)
    res.send(result);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = CategoryRoute;
