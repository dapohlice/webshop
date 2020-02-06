import {Request,Response} from "express";
import {BaseRouter} from "./BaseRouter";
import * as Login from "../mapper/LoginMapper";


/**
 * express Router für Bestellungen
 */
export default class LoginRouter extends BaseRouter{

    initialiseRouter(){
        this.router.post('/login',this.login);
    }

    async login(req: Request, res: Response)
    {
        let loginname = req.body.loginname;
        let password = req.body.password;

        if(!loginname || !password)
        {
            res.sendStatus(400);
            return;
        }

        let status,result;
        [status,result] = await Login.login(loginname,password);
        if(result !== null)
            res.send(result);
        else
            res.sendStatus(status);
    }
}


