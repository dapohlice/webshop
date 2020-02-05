import {Request,Response} from "express";

import * as GroupMapper from "../mapper/GroupMapper";
import {BaseRouter} from "./BaseRouter";
import * as Login from "../mapper/LoginMapper";
import resolve from '../resolver';
import {verifyJWT} from "../jwt/verify"
import { hashPassword } from "../mapper/Password";


/**
 * express Router für Bestellungen
 */
export default class GroupRouter extends BaseRouter{

    initialiseRouter(){
        this.router.post('/login',this.login);
        this.router.post('/logout',this.logout);
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

        let status,result
        [status,result] = await Login.login(loginname,password);
        if(result !== null)
            res.send(result);
        else
            res.sendStatus(status);
    }

    async logout(req: Request, res: Response)
    {
        res.send(await hashPassword(req.body.pw))
    }
}


