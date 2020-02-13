import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from 'express';
import UserRouter from "./router/UserRouter";
import MyUserRouter from "./router/MyUserRouter";
import GroupRouter from "./router/GroupRouter";
import LoginRouter from "./router/LoginRouter";

const port = process.env.PORT;
const stage = process.env.NODE_ENV;


// loging function
function logRequest(req: express.Request,res: express.Response,next)
{
    console.log(`${req.method} ${req.originalUrl} from ${req.ip}`)
    next()
}

function logError(err,req: express.Request,res: express.Response,next)
{
    console.error(err);
    res.sendStatus(500);
}

function setHeader(req: express.Request, res: express.Response,next)
{
    res.set('Access-Control-Allow-Origin','*')
    res.set('Access-Control-Allow-Headers','*')
    next();
}

createConnection().then(async connection => {
    const app = express()
    // log every request
    app.use(logRequest);

    app.use(setHeader);

    // convert body to json
    app.use(express.json());

    app.use('/user', new UserRouter().getRouter())
    app.use('/me', new MyUserRouter().getRouter())
    app.use('/group', new GroupRouter().getRouter())
    app.use('/', new LoginRouter().getRouter())
    
    app.use(logError);
    // start app
    app.listen(port, () => console.log(`User Service (${stage}) Listen On ${port}`))

}).catch(error => console.log(error));
