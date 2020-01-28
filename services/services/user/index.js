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


app.get('/', (req, res) => res.send('Hello World!'))


/**
 * Starten
 */
app.listen(port, () => console.log(`User Service (${stage}) Listen On ${port}`))

