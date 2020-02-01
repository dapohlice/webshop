const express = require('express');

const app = express();

const port = process.env.PORT;
const stage = process.env.NODE_ENV;

// Test mit Clocks nur zum Spaß (Kommt wieder raus)
const start = Date.now();
const startDateTime = new Date(1995,11,4,0,0,0,0); // Erstes Release von Javascript

// functions
function setHeader(req,res,next)
{
  res.set('Access-Control-Allow-Origin', '*')
  next()
}
app.use(setHeader);
/* loging functions
*/

// jeden Request
function logRequest(req,res,next)
{
    console.log(`Request ${req.method} ${req.originalUrl} from ${req.ip}`)
    next()
}
app.use(logRequest);

// jeden Fehler
function logError(err,req,res,next)
{
    console.error(`Request ${req.method} ${req.originalUrl} from ${req.ip} FAILED`)
    console.error(err);
}
app.use(logError);



/**
 * Hauptapp
 */

// View Engine von template-engine: pug einbinden
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
 // statische Dateien werden von `public` ordner
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  for (const key in req.query) {
    console.log(key, req.query.order[key])
  }
  switch(req.query.order) {
    case 'open':
      res.render('order', {
        name : 'openOrder',
        title: 'Open Order - Administration Dashboard',
      });
      break;
    case 'paid':
      res.render('order', {
        name : 'paidOrder',
        title: 'Paid Order - Administration Dashboard',
      });
      break;
    case 'packed':
      res.render('order', {
        name : 'packedOrder',
        title: 'Packed Order - Administration Dashboard',
      });
      break;
    case 'returns':
      res.render('order', {
        name : 'returnsOrder',
        title: 'Returns Order - Administration Dashboard',
      });
      break;
    default:
      res.render('index', {
        name : 'index',
        title: 'Welcome Employee - Administration Dashboard',
      });
  }
  // if (req.query.order === 'open') {
  //   res.render('order', {
  //     name : 'openOrder',
  //     title: 'Open Order - Administration Dashboard',
  //   });
  // } else if (req.query.order === 'paid') {
  //   res.render('order', {
  //     name : 'paidOrder',
  //     title: 'Paid Order - Administration Dashboard',
  //   });
  // } else if (req.query.order === 'packed') {
  //   res.render('order', {
  //     name : 'packedOrder',
  //     title: 'Packed Order - Administration Dashboard',
  //   });
  // } else if (req.query.order === 'returns') {
  //   res.render('order', {
  //     name : 'returnsOrder',
  //     title: 'Returns Order - Administration Dashboard',
  //   });
  // } else {
  //   res.render('index', {
  //     name : 'index',
  //     title: 'Welcome Employee - Administration Dashboard',
  //   });
  // }

});

app.get('/user', (req, res) => {
  res.render('user', {
    name : 'user',
    title: 'User - Administration Dashboard',
    order: Math.floor(millis/1000),
    date: startDateTime
  });
});

// app.get('/order', (req, res) => {
//
//   res.render('order', {
//     name : 'open',
//     title: 'Open Order - Administration Dashboard',
//   });
// });



/**
 * Starten
 */
app.listen(port, () => console.log(`Picture Service (${stage}) Listen On ${port}`))
