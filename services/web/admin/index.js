const express = require('express');

const app = express();

const port = process.env.PORT;
const stage = process.env.NODE_ENV;

const people = require('./people.json');

// Spaß mit Clocks
const start = Date.now();
const startDateTime = new Date(1995,11,4,0,0,0,0); // Erstes Release von Javascript
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

app.get('/', (req, res) => {
  const millis = Date.now() - start;
  res.render('index', {
    title: 'Welcome Employee - Administration Dashboard',
    order: Math.floor(millis/1000),
    date: startDateTime
  });
});

app.get('/user', (req, res) => {
  const millis = Date.now() - start;
  res.render('user', {
    title: 'User - Administration Dashboard',
    order: Math.floor(millis/1000),
    date: startDateTime
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
