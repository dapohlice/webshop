const Express = require('express');
const Productsapp = Express();
const BParser = require('body-parser');
const Assistant = require('./queryassistant.js');

const port = process.env.PORT;
const stage = process.env.NODE_ENV;
/* loging functions*/
// jeden Request
function logRequest(req,res,next)
{
    console.log(`Request ${req.method} ${req.originalUrl} from ${req.ip}`)
    next()
}
Productsapp.use(logRequest);

// jeden Fehler
function logError(err,req,res,next)
{
    console.error(`Request ${req.method} ${req.originalUrl} from ${req.ip} FAILED`)
    console.error(err);
}
Productsapp.use(logError);
Productsapp.use(BParser.json());


/*Get-Request für alle Artikeldatensätze*/
Productsapp.get("/article", async (req,res) =>
{
    try
    {
      console.log(req.body);
      let result = await Models.ProductModel.find().exec();
      res.send(result);
    }
    catch (err)
    {
      console.error(err);
      res.sendStatus(404);
    }
});
/*Get-Request für einen Artikeldatensatzes über seine ID*/
Productsapp.get("/article/:id", async (reg,res) =>
{
  try
  {
        let result = Models.productmodel.find({productid: reg.params.id});
        res.send(result);
  }
  catch (err)
  {
    console.error(err);
    res.sendStatus(404);
  }
});

/*Post-Request zum erstellen eines neuen Artikeldatensatzes*/
Productsapp.post("/article", async (req,res) =>
{
    try
    {
      let article = new Models.ProductModel(req.body);
      let result =  await article.save();
      res.send(result);
    }
    catch (err)
    {
      console.error(err);
      res.status(404).send(err);
    }
});

/*Put-Request zum bearbeiten eines Artikeldatensatzes*/
Productsapp.put("/article:id", async (req,res) =>
{
  try
  {
    console.log(req.body);
    dest = await Models.ProductModel.find({productid: req.params.id}).exec();
    dest.set(reg.body);
    let result = await dest.save();
    res.send(result);
  }
  catch (err)
  {
    console.error(err);
    res.sendStatus(404);
  }
});

/*Patch-Request zum aktivieren und deaktivieren eines Artikeldatensatzes*/
Productsapp.patch("/article:id", async (req,res) =>
{
  try
  {
    if(reg.body.state)
    {
    let dest = await Models.ProductModel.find({productid: req.params.id}).exec();
    dest.set({state: reg.body.state});
    let result = await dest.save();
    res.send(result);
    }
  }
  catch (err)
  {
    console.error(err);
    res.sendStatus(404);
  }
});
/*----------------------------------------------------------------------------*/
/*POST-Request zum anlegen eines neue Kategoriedatensatzes*/
Productsapp.post("/category", async (req,res) =>
{
  try
  {
    let result =  await Assistant.Category.createCategory(req.body);
    res.send(result);
  }
  catch (err)
  {
    res.status(404).send(err);
  }
});

/*PUT_Request zum bearbeiten eines Kategoriedatensatzes*/
Productsapp.put("/category/:id", async (req,res) =>
{
  try
  {
    let result = await Assistant.Category.updateCategory(req.params.id, req.body);
    res.send(result);
  }
  catch (err)
  {

  }
});

/*DELETE-Request zum löschen eines Kategoriedatensatzes*/
Productsapp.delete("/category/:id", async (req,res) =>
{
  try
  {
    let result = Models.Category.deleteCategory(req.params.id);
    res.send(result);
  }
  catch (err)
  {
    res.status(404).send(err);
  }
});

/*GET-Request zum ausgeben aller Kategoriedatensätz*/
Productsapp.get("/category", async (req,res) =>
{
    try
    {
      let result = await Assistant.Category.getAll();
      res.send(result);
    }
    catch (err)
    {
      send.status(404).send(err);
    }
});

/*GET-Request zum finden eines Kategoriedatensatzes*/
Productsapp.get("/category/:id", async (req,res) =>
{
  try
  {
    let result = await Assistant.Category.getCategoryByID(reg.params.id)
    res.send(result);
  }
  catch (err)
  {
    send.status(404).send(err);
  }
});



Productsapp.listen(port,()=>console.log(`Product Service (${stage}) Listen On ${port}`));
