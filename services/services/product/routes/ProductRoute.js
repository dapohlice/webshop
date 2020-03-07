const BParser = require('body-parser');
const Express = require('express');
const Assistant = require('../database/QueryAssistant.js');
const ErrorHandler = require('./ErrorHandler.js');
const ProductRoute = Express.Router();

ProductRoute.use(BParser.json());
ProductRoute.use(BParser.urlencoded({extended: true}));
/*------------------------Hauptartikel----------------------------------------*/
/*Post-Request zum erstellen eines neuen Artikeldatensatzes*/
ProductRoute.post("/", async function (req,res){
  try {
    let result = await Assistant.Product.createProduct(req.body);
    res.status(201).send(result);
  } catch (err) {
    let result = await ErrorHandler.StdHandler.checkError(err);
    res.status(result.statuscode).send(result);
  }
});

/*Put-Request zum bearbeiten eines Artikeldatensatzes*/
ProductRoute.put("/:id", async function (req,res) {
  try {
    let result = await Assistant.Product.updateProduct(req.params.id, req.body);
    res.status(200).send(result);
  }
  catch (err)
  {
    let result = await ErrorHandler.StdHandler.checkError(err);
    res.status(result.statuscode).send(result);
  }
});

/*Patch-Request zum aktivieren und deaktivieren eines Artikeldatensatzes*/
ProductRoute.patch("/:id", async function (req,res) {
  try {
    if(req.body.state === true || req.body.state === false)
    {
      await Assistant.Product.changeState(req.params.id, req.body.state);
      res.sendStatus(200);
    }
    else
    {
      res.sendStatus(400);
    }
  } catch (err) {
    let result = await ErrorHandler.StdHandler.checkError(err);
    res.status(result.statuscode).send(result);
  }
});

/*Get-Request für alle Artikeldatensätze*/
ProductRoute.get("/", async function (req,res) {
  try {
    if (req.jwt !== undefined) {
      let result = await Assistant.Product.getAllProducts();
      res.status(200).send(result);
    }
    else {
      let result = await Assistant.Product.getAllActiveProducts();
      res.status(200).send(result);
    }
  } catch (err) {
      let result = await ErrorHandler.StdHandler.checkError(err);
      res.status(result.statuscode).send(result);
    }
});

/*Get-Request für einen Artikeldatensatzes über seine ID*/
ProductRoute.get("/:id", async function (req,res) {
  try {
    let result = await Assistant.Product.getProductByID(req.params.id);
    res.status(200).send(result);
  } catch (err) {
    let result = await ErrorHandler.StdHandler.checkError(err);
    res.status(result.statuscode).send(result);
  }
});
/*----------------------------------------------------------------------------*/
/*-------------------------------Eigenschaften---------------------------------*/
/*GET-Request zum finden aller Eigenschaftsdatensätze eines Artikels*/
ProductRoute.get("/:id/propertys", async function(req, res) {
  try {
    let result = await Assistant.Product.getAllPropertys(req.params.id);
    res.status(200).send(result);
  } catch (err) {
    let result = await ErrorHandler.StdHandler.checkError(err);
    res.status(result.statuscode).send(result);
  }
});
/*POST-Request zum erstellen eines/mehrere SubArtikel zu einem Artikel*/
ProductRoute.post("/:id/propertys", async function(req, res) {
  try {
    let result = await Assistant.Product.createProperty(req.params.id, req.body);
    res.status(201).send(result);
  } catch (err) {
    let result = await ErrorHandler.StdHandler.checkError(err);
    res.status(result.statuscode).send(result);
  }
});
/*PATCH-Request zum ändern der Artikelmenge*/
ProductRoute.patch("/:id/property/:subid", async function(req, res)
{
  try {
    let result = await Assistant.Product.changePropertyAmount(req.params.id, req.params.subid, req.body);
    res.send(result);
  } catch (err) {
    let result = await ErrorHandler.StdHandler.checkError(err);
    res.status(result.statuscode).send(result);
  }
});
module.exports = ProductRoute;
