import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from 'express';
import UserRouter from './router/UserRouter';

const port = 3001

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

    app.use('/user',new UserRouter().getRouter());

    // start app
    app.listen(port, ()=> console.log(`Node Express Run on ${port}`));

}).catch(error => console.log(error));
