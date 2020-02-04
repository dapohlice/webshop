import {Request,Response} from "express";

import * as UserMapper from "../mapper/UserMapper";
import {BaseRouter} from "./BaseRouter";
import resolve from '../resolver';


/**
 * express Router für Bestellungen
 */
export default class UserRouter extends BaseRouter{

    initialiseRouter(){
        this.router.get('/',this.get);
        this.router.post('/',this.createUser);
        this.router.get('/:id',this.getOne);
        this.router.put('/:id',this.changeUser);
        this.router.patch('/:id',this.changeStatus);
        this.router.patch('/:id/password',this.changePassword)
        this.router.get('/:id/permission',this.getPermission)
        
    }
    /**
     * Gibt alle Bestellungen zurück
     * @param req 
     * @param res 
     */
    async get(req: Request, res: Response)
    {
        let orders,err;
        [orders,err] = await resolve(UserMapper.getAllUsers());
        if(err !== null || orders === undefined)
        {
            res.sendStatus(500);
            return;            
        }

        res.json(
            orders
        );
    }

    /**
     * Gibt eine komplette Bestellung zurück
     * @param req 
     * @param res 
     */
    async getOne(req: Request, res: Response)
    {
        let id = parseInt(req.params.id);
        if(!Number.isInteger(id))
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

        res.json(
            result
        );
    }

    /**
     * setzt den Status einer Bestellung
     * @param req 
     * @param res 
     */
    async changeUser(req: Request, res: Response)
    {
        let id = parseInt(req.params.id);
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let mail = req.body.mail;
        
        if(!Number.isInteger(id))
        {
            res.sendStatus(400);
            return;   
        }

        if(!firstname && !lastname && !mail)
        {
            res.sendStatus(400);
            return;
        }

        let result,err;

        [result,err] = await resolve(UserMapper.changeUser(id,firstname,lastname,mail));

        if(err !== null)
        {
            res.sendStatus(500);
            return;
        }

        if(result == false)
        {
            res.sendStatus(400);
            return;
        }

        res.send(result);

    }

    /**
     * Erstellt eine neue Bestellung
     * @param req 
     * @param res 
     */
    async createUser(req: Request, res: Response)
    {
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let mail = req.body.mail;
        if(!mail || !lastname ||!firstname)
        {
            res.sendStatus(400);
            return;
        }

        let result,err;
        [result,err] = await resolve(UserMapper.createUser(firstname,lastname,mail));
        if(err !== null)
        {
            res.sendStatus(500);
            return;            
        }
        if(result === undefined)
        {
            res.sendStatus(400);
            return;
        }

        res.send(result);
    }

    /**
     * Ändert den Status eines Benutzers
     * @param req 
     * @param res 
     */
    async changeStatus(req: Request, res: Response)
    {
        console.log("change");
        
        let id = parseInt(req.params.id);
        if(!Number.isInteger(id))
        {
            res.sendStatus(400);
            return;   
        }

        let status;
        if(req.body.status == "active")
            status = true;
        else if(req.body.status == "inactive")
        {
            status = false;
        }else{
            res.sendStatus(400);
            return;
        }

        
        let result,err;
        [result,err] = await resolve(UserMapper.changeStatus(id,status));

        if(err !== null)
        {
            res.sendStatus(500);
            return;            
        }

        if(result)
        {
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    }

    async changePassword(req: Request, res: Response)
    {
        let id = parseInt(req.params.id);
        if(!Number.isInteger(id))
        {
            res.sendStatus(400);
            return;   
        }
        let newPassword = req.body.newPassword;
        let oldPassword = req.body.oldPassword;
        if(!newPassword && !oldPassword)
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

    async getPermission(req: Request, res: Response){
        let id = parseInt(req.params.id);
        if(!Number.isInteger(id))
        {
            res.sendStatus(400);
            return;   
        }
        res.send(await UserMapper.getUserPermission(id))
    }


}


