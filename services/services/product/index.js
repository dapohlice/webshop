const express = require('express');
const productsapp = express();

const mongoClient = require('mongodb').mongoClient;
const url = "mongodb://root:passw0rd@localhost:27017/";

/* loging functions
*/
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

/*Get-Requests ab der Wurzel abfangen*/
productsapp.get('/',(reg,res) => {

  /*Get-Request zum anzeigen aller Artikels*/
  productsapp.get('/article',(reg,res) =>{});

  /*Get-Request zum abzeigen eines Artikels über die Artikel-ID*/
  productsapp.get('/article/:id', (reg,res) => {
    let id = reg.params.id;
  });
});

/*Post-Request ab der Wurzel abfangen*/
productsapp.post('/',(reg,res) => {

  /*Post-Request zum anlegen eines neuen Artikeldatensatzes*/
  productsapp.post('/article',(reg,res) => {});
});

/*Put-Request ab der Wurzel abgfangen*/
productsapp.put('/',(reg,res) => {
  /*Put-Request zum bearbeiten eines Artikeldatensatzes über seine ID*/
  productsapp.put('/article/:id',(reg,res) =>{
    let id = reg.params.id;
  });
});
