const Express = require('express');
const Mongoose = require('mongoose');
const BParser = require('body-parser');
const PModel = require('./pschema');
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
      if(reg.body.id)
      {
        let result = PModel.find({productid: reg.body.id});
        res.send(result);
      }
  }
  catch (err)
  {
    res.status(500).send(err);
  }
});

/*Post-Request zum erstellen eines neuen Artikeldatensatzes*/
Productsapp.post("/articel", async (req,res) =>
{
  //Überprüfung des Request auf Fehlerhaft übermittelte Datenbank
  // Wird später noch in die valitor.js ausgelagert
  if(reg.body.name && reg.body.price)
  {
    try
    {
      let data = {
        name: reg.body.name,
        price: reg.body.price,
      }
      let article = new PModel(data);
      let result =  await article.save();
      res.send(result);
    }
    catch (err)
    {
      res.status(500).send(err);
    }
  }
});

/*Put-Request zum bearbeiten eines Artikeldatensatzes*/
Productsapp.put("/artikel:id", async (reg,res) =>
{
  if(reg.body.id)
  {
  }
});
