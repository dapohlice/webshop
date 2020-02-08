import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from 'express';
import OrderRouter from "./router/OrderRouter";
import StatusRouter from "./router/StatusRouter";


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

function setHeader(req: express.Request, res: express.Response,next)
{
    res.set('Access-Control-Allow-Origin','*')
    res.set('Access-Control-Allow-Methods','GET, POST, PATCH, POST, PUT, OPTIONS, DELETE')
    next();
}

createConnection().then(async connection => {
    const app = express()
    // log every request
    app.use(logRequest);
    app.use(logError);
    app.use(setHeader);

    // convert body to json
    app.use(express.json());

    app.use('/order', new OrderRouter().getRouter())

    app.use('/status',new StatusRouter().getRouter())

    // start app
    app.listen(port, () => console.log(`Order Service (${stage}) Listen On ${port}`))

}).catch(error => console.log(error));
