const Express = require('express');
const Productsapp = Express();
const BParser = require('body-parser');
const CategoryRoute = require('./routes/CategoryRoute.js');
const ProductRoute = require('./routes/ProductRoute.js');


const port = process.env.PORT;
const stage = process.env.NODE_ENV;
// functions
function setHeader(req,res,next)
{
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.set('Access-Control-Max-Age', '86400'); // 24 hours
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization,cache-control');
  res.set('Access-Control-Allow-Credentials', false);
  next()
}
Productsapp.use(setHeader);
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

/*Routen der Productapp hinzufügen*/
Productsapp.use("/category", CategoryRoute);
Productsapp.use("/article", ProductRoute);

Productsapp.listen(port,()=>console.log(`Product Service (${stage}) Listen On ${port}`));
