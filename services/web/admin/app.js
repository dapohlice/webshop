const express = require('express');
const JWT = require('./jwt/verify.js');

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
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.set('Access-Control-Max-Age', '86400'); // 24 hours
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.set('Access-Control-Allow-Credentials', false);
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

function getCookie(req,name)
{
  let result = null;
  let rc = req.headers.cookie;

  rc && rc.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    if(parts.shift() === name)
    {
      result = parts.join('=');
    }
  });
  return result;
}

// View Engine von template-engine: pug einbinden
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

function checkPermission(req,res,next)
{
  let token = getCookie(req,'jwt');
  if(token === null)
  {
    if(req.header('Accept').startsWith('text/html'))
      res.render('401');
    else 
      res.sendStatus(401)
    return;
  }
  let jwt,result;
  [result,jwt] = JWT.processJwt(token);
  if(result !== 200)
  {
    if(req.header('Accept').startsWith('text/html'))
      res.render('401');
    else 
      res.sendStatus(result)
    return;
  }
  req.jwt = jwt;
  next();
}
app.use(checkPermission);


/**
 * Hauptapp
 */


 // statische Dateien werden von `public` ordner
app.use(express.static(__dirname + '/public'));

app.get('/login', (req,res)=>{
  res.render('login');
});

app.get('/', (req, res) => {

  for (const key in req.query) {
    console.log(key, req.query.ap[key]);
  }
  switch(req.query.ap) {
    case 'users':
      res.render('user', {
        name : 'user',
        title: 'Users - Administration Dashboard',
      });
      break;
    case 'groups':
      res.render('group', {
        name : 'group',
        title: 'Groups - Administration Dashboard',
      });
      break;
    case 'articles':
      res.render('article', {
        name : 'article',
        title: 'Articles - Administration Dashboard',
      });
      break;
    case 'categories':
      res.render('category', {
        name : 'category',
        title: 'Categories - Administration Dashboard',
      });
      break;
    case 'ordered':
      res.render('order', {
        name : 'ordered',
        title: 'Ordered Order - Administration Dashboard',
      });
      break;
    case 'payed':
      res.render('order', {
        name : 'payed',
        title: 'Payed Order - Administration Dashboard',
      });
      break;
    case 'packed':
      res.render('order', {
        name : 'packed',
        title: 'Packed Order - Administration Dashboard',
      });
      break;
    case 'finished':
      res.render('order', {
        name : 'finished',
        title: 'Finished Order - Administration Dashboard',
      });
      break;
    case 'returned':
      res.render('order', {
        name : 'returned',
        title: 'Returned Order - Administration Dashboard',
      });
      break;
    case 'all':
      res.render('order', {
        name : 'all',
        title: 'All Order - Administration Dashboard',
      });
      break;
    default:
      res.render('index', {
        name : 'index',
        title: 'Welcome Employee - Administration Dashboard',
      });
  }
});


/**
 * Starten
 */
app.listen(port, () => console.log(`Picture Service (${stage}) Listen On ${port}`))
