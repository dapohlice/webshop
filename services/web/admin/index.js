const express = require('express');

const app = express();

const port = process.env.PORT;
const stage = process.env.NODE_ENV;

const people = require('./people.json');
// Versuch bootstrap als node-module einzubinden
// var jquery = require('jquery');
// var bootstrap = require('bootstrap');
// var scss_boot = require('~bootstrap/scss/bootstrap');
// var scss = require('./scss/app.scss');

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
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
 // serve static files from the `public` folder
app.use(express.static(__dirname + '/public'));
// app.use('/jsB', express.static('/node_modules/jquery/dist')); // redirect JS jQuery
// app.use('/cssB', express.static('/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Administration Dashboard',
  });
});


// app.get('/profile', (req, res) => {
//   const person = people.profiles.find(p => p.id === req.query.id);
//   res.render('profile', {
//     title: `About ${person.firstname} ${person.lastname}`,
//     person,
//   });
// });


/**
 * Starten
 */
app.listen(port, () => console.log(`Picture Service (${stage}) Listen On ${port}`))
