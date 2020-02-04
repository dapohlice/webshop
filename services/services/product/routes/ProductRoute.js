const BParser = require('body-parser');
const Express = require('express');
const Assistant = require('../database/QueryAssistant.js');
const ProductRoute = Express.Router();

ProductRoute.use(BParser.json());
/*------------------------Hauptartikel----------------------------------------*/
/*Post-Request zum erstellen eines neuen Artikeldatensatzes*/
ProductRoute.post("/", async function (req,res){
    try {
      let result = await Assistant.Product.createProduct(req.body);
      res.send(result);
    } catch (err) {
      res.status(404).send(err);
    }
});

/*Put-Request zum bearbeiten eines Artikeldatensatzes*/
ProductRoute.put("/:id", async function (req,res) {
  try {
    let result = await Assistant.Product.updateProduct(req.params.id, req.body);
    res.send(result);
  }
  catch (err)
  {
    res.status(404).send(err);
  }
});

/*Patch-Request zum aktivieren und deaktivieren eines Artikeldatensatzes*/
ProductRoute.patch("/:id", async function (req,res) {
  try {
    if(reg.body.state)
    {
      let result = await Assistant.Product.changeState(req.params.id, req.body.state);
      res.send(result);
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

/*Get-Request für alle Artikeldatensätze*/
ProductRoute.get("/", async function (req,res) {
    try {
      let result = await Assistant.Product.getAllProducts();
      res.send(result);
    } catch (err) {
      res.status(404).send(result);
    }
});

/*Get-Request für einen Artikeldatensatzes über seine ID*/
ProductRoute.get("/:id", async function (reg,res) {
  try {
    let result = await Assistant.Product.getProductsById(req.params.id)
    res.send(result);
  } catch (err) {
    res.sendStatus(404);
  }
});
/*----------------------------------------------------------------------------*/
/*-------------------------------Eigenschaften---------------------------------*/
/*GET-Request zum Azeigen aller Unteratikeldatensätze eines Artikels*/
ProductRoute.get("/:id/propertys", async function(req, res) {
  try {

  } catch (err) {

  }
});
/*POST-Request zum erstellen einer Eigenschaft zu einem Artikels*/
ProductRoute.post("/:id/property", async function(req, res) {
  try {

  } catch (err) {

  }
});
/*POST-Request zum erstellen mehrerer Eigenschafte zu einem Artikels*/
ProductRoute.post("/:id/propertys", async function(req, res) {
  try {

  } catch (err) {

  }
});
/*PATCH-Request zum änderern der Artikelmenge*/
ProductRoute.patch("/:id/property", async function(req, res)
{
  try {

  } catch (err) {

  }
});

module.exports = ProductRoute;
