const express = require('express');
const Mongoose = require('mongoose');
const pmodel = require('./pschema');
const productsapp = express();
/* loging functions*/
// jeden Request
function logRequest(req,res,next)
{
    console.log(`Request ${req.method} ${req.originalUrl} from ${req.ip}`)
    next()
}
productsapp.use(logRequest);

// jeden Fehler
function logError(err,req,res,next)
{
    console.error(`Request ${req.method} ${req.originalUrl} from ${req.ip} FAILED`)
    console.error(err);
}
productsapp.use(logError);
/*Verbindung zur Datenbank erstellen*/
Mongoose.connect("mongodb://localhost:27017/product", {user: 'root',
                                                       pass: 'passw0rd',
                                                       useNewUrlParser: true,
                                                       useUnifiedTopology: true },
                                                       function(err){});
let db = Mongoose.connection;

/*Post-Request zum erstellen eines Neuen Produktes*/
productsapp.post("/articel", (req,res) =>
{
  if(reg.body.name && reg.body.price)
  {
    try
    {
      let data = {
        name: reg.body.name,
        price: reg.body.price,
      }
      let article = new pmodel(data);
      let result =  article.save();
      res.send(result);
    }
    catch (error)
    {
      res.status(500).send(error);
    }
  }
});
