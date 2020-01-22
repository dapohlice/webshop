import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from 'express';

const port = process.env.PORT;
const stage = process.env.NODE_ENV;


// loging function
function logRequest(req: express.Request,res: express.Response,next)
{
    console.log(`Request ${req.method} ${req.originalUrl} from ${req.ip}`)
    next()
}

function logError(err,req: express.Request,res: express.Response,next)
{
    console.error(err);
}

createConnection().then(async connection => {
    const app = express()
    // log every request
    app.use(logRequest);
    app.use(logError);

    // convert body to json
    app.use(express.json());

    app.get('/', (req, res) => res.send('Hello World!'))

    // start app
    app.listen(port, () => console.log(`Picture Service (${stage}) Listen On ${port}`))

}).catch(error => console.log(error));
