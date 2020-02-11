const BParser = require('body-parser');
const Express = require('express');
const Assistant = require('../database/QueryAssistant.js');
const ProductRoute = Express.Router();

ProductRoute.use(BParser.json());
ProductRoute.use(BParser.urlencoded({extended: true}));
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
    let result = await Assistant.Product.getProductsById(req.params.id);
    res.send(result);
  } catch (err) {
    res.sendStatus(404);
  }
});
/*----------------------------------------------------------------------------*/
/*-------------------------------Eigenschaften---------------------------------*/
/*GET-Request zum finden aller Eigenschaftsdatensätze eines Artikels*/
ProductRoute.get("/:id/propertys", async function(req, res) {
  try {
    let result = await Assistant.Product.getAllPropertys(req.params.id);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(404).send(err);
  }
});
/*POST-Request zum erstellen eines/mehrere SubArtikel zu einem Artikel*/
ProductRoute.post("/:id/propertys", async function(req, res) {
  try {
    console.log(req.body);
    let result = await Assistant.Product.createProperty(req.params.id, req.body);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(404).send(err);
  }
});
/*PATCH-Request zum ändern der Artikelmenge*/
ProductRoute.patch("/:id/property/:subid", async function(req, res)
{
  try {
    let result = await Assistant.Product.changePropertyAmount(req.params.id, req.params.subid, req.body);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(404).send(err);
  }
});
module.exports = ProductRoute;
