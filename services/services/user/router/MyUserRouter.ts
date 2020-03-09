import {Request,Response} from "express";

import * as UserMapper from "../mapper/UserMapper";
import {BaseRouter} from "./BaseRouter";
import resolve from '../resolver';


/**
 * express Router für Bestellungen
 */
export default class MyUserRouter extends BaseRouter{

    constructor(){
        super(true);
    }

    initialiseRouter(){
        this.router.use(this.checkPermission);
        this.router.get('/',this.getMyUser);
        this.router.patch('/password',this.changeMyPassword)
        
    }
    /**
     * Überprüft die Berechtigung
     * @param req 
     * @param res 
     * @param next 
     */
    checkPermission(req,res,next)
    {
        if(
            req.jwt !== undefined
        )
            next();
        else
            res.sendStatus(403);
    }



    /**
     * Gibt eine komplette Benutzer zurück
     * @param req 
     * @param res 
     */
    async getMyUser(req: Request, res: Response)
    {
        let loginname = req.jwt.name;

        let id = await UserMapper.getUserIdByLoginname(loginname)
        if(id === undefined)
        {
            res.sendStatus(400);
            return;
        }

        let result,err;
        [result,err] = await resolve(UserMapper.getOneUser(id));
        if(err !== null)
        {
            res.sendStatus(500);
            return;            
        }

        if(result === undefined)
        {
            res.sendStatus(404);
            return;
        }

        let auth;
        [auth,err] = await resolve(UserMapper.getUserPermission(id));
        if(err !== null)
        {
            res.sendStatus(500);
            return;   
        }
        if(auth === undefined)
        {
            res.sendStatus(404);
            return;
        }
        delete result.groups;
        result.auth = auth;

        res.json(result);
    }



    /**
     * Ändert das Passwort eines Benutzers
     * @param req 
     * @param res 
     */
    async changeMyPassword(req: Request, res: Response)
    {
        let loginname = req.jwt.name;

        let id = await UserMapper.getUserIdByLoginname(loginname)
        if(id === undefined)
        {
            res.sendStatus(400);
            return;
        }

        console.log(id)

        let newPassword = req.body.newPassword;
        let oldPassword = req.body.oldPassword;
        if(newPassword === undefined || oldPassword === undefined)
        {
            res.sendStatus(400);
            return;
        }

        let result,err;
        [result,err] = await resolve(UserMapper.changePassword(id,oldPassword,newPassword));

        if(err !== null)
        {
            res.sendStatus(500);
            return;            
        }

        res.sendStatus(result);

    }
}


