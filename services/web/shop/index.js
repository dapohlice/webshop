const express = require('express');

const app = express();

const port = process.env.PORT;
const stage = process.env.NODE_ENV;

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
app.set('views',__dirname + '/views');
// serve static files from the `public` folder
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
  res.render('layaut');
});


/**
 * Starten
 */
app.listen(port, () => console.log(`Picture Service (${stage}) Listen On ${port}`))
