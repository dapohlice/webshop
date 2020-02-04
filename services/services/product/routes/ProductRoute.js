const BParser = require('body-parser');
const Express = require('express');
const Assistant = require('../database/QueryAssistant.js');
const ProductRoute = Express.Router();

ProductRoute.use(BParser.json());

/*Post-Request zum erstellen eines neuen Artikeldatensatzes*/
ProductRoute.post("/", async function (req,res){
    try {
      let result = Assistant.Product.createProduct(req.body);
      res.send(result);
    } catch (err) {
      res.status(404).send(err);
    }
});

/*Put-Request zum bearbeiten eines Artikeldatensatzes*/
ProductRoute.put("/:id", async function (req,res) {
  try {
    let result = Assistant.Product.updateProduct(req.params.id, req.body);
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
      let result = Assistant.Product.changeState(req.params.id, req.body.state);
      res.send(result);
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

/*Get-Request für alle Artikeldatensätze*/
ProductRoute.get("/", async function (req,res) {
    try {
      let result = Assistant.Product.getAllProducts();
      res.send(result);
    } catch (err) {
      res.status(404).send(result);
    }
});

/*Get-Request für einen Artikeldatensatzes über seine ID*/
ProductRoute.get("/article/:id", async function (reg,res) {
  try {
    let result = Assistant.Product.getProductsById(req.params.id)
    res.send(result);
  } catch (err) {
    res.sendStatus(404);
  }
});

module.exports = ProductRoute;
