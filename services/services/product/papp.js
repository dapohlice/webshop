const Express = require('express');
const Mongoose = require('mongoose');
const BParser = require('body-parser');
const PModel = require('./productschema');
const Productsapp = Express();
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
/*Verbindung zur Datenbank erstellen*/
Mongoose.connect("mongodb://localhost:27017/product", {user: 'root',
                                                       pass: 'passw0rd',
                                                       useNewUrlParser: true,
                                                       useUnifiedTopology: true },
                                                       function(err){});
let db = Mongoose.connection;

/*Get-Request für alle Artikeldatensätze*/
Productsapp.get("/article", async (req,res) =>
{
    try
    {
      let result = await PModel.find().exec();
      res.send(result);
    }
    catch (err)
    {
      res.status(500).send(err);
    }
});
/*Get-Request für einen Artikeldatensatzes über seine ID*/
Productsapp.get("/article:id", async (reg,res) =>
{
  try
  {
        let result = PModel.find({productid: reg.params.id});
        res.send(result);
  }
  catch (err)
  {
    res.status(500).send(err);
  }
});

/*Post-Request zum erstellen eines neuen Artikeldatensatzes*/
Productsapp.post("/article", async (req,res) =>
{
    try
    {
      let article = new PModel(reg.body);
      let result =  await article.save();
      res.send(result);
    }
    catch (err)
    {
      res.status(500).send(err);
    }
});

/*Put-Request zum bearbeiten eines Artikeldatensatzes*/
Productsapp.put("/article:id", async (reg,res) =>
{
  try
  {
    dest = await PModel.find({productid: reg.params.id}).exec();
    dest.set(reg.body);
    let result = await dest.save();
    res.send(result);
  }
  catch (err)
  {
    res.send(result);
  }
});

/*Patch-Request zum aktivieren und deaktivieren eines Artikeldatensatzes*/
Productsapp.patch("/article:id", async (reg,res) =>
{
  try
  {
    if(reg.body.state)
    {
    let dest = await PModel.find({productid: reg.params.id}).exec();
    dest.set({state: reg.body.state});
    let result = await dest.save();
    res.send(result);
    }
  }
  catch (err)
  {
    res.status(500).send(err);
  }
});
