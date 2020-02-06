import {Request,Response} from "express";

import * as UserMapper from "../mapper/UserMapper";
import {BaseRouter} from "./BaseRouter";
import resolve from '../resolver';


/**
 * express Router für Bestellungen
 */
export default class UserRouter extends BaseRouter{

    constructor(){
        super(true);
    }

    initialiseRouter(){
        this.router.use(this.checkPermission);
        this.router.get('/',this.get);
        this.router.post('/',this.createUser);
        this.router.get('/:id',this.getOne);
        this.router.put('/:id',this.changeUser);
        this.router.patch('/:id',this.changeStatus);
        this.router.patch('/:id/resetpassword',this.resetPassword)
        this.router.get('/:id/permission',this.getPermission)
        
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
            req.jwt !== undefined &&
            req.jwt.auth.auth_user === true
        )
            next();
        else
            res.sendStatus(403);
    }

    /**
     * Gibt alle Benutzer zurück
     * @param req 
     * @param res 
     */
    async get(req: Request, res: Response)
    {
        let users,err;
        [users,err] = await resolve(UserMapper.getAllUsers());
        if(err !== null || users === undefined)
        {
            res.sendStatus(500);
            return;            
        }

        res.json(users);
    }

    /**
     * Gibt eine komplette Benutzer zurück
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

        res.json(result);
    }

    /**
     * Ändert einen Benutzer
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

        if(result === undefined)
        {
            res.sendStatus(400);
            return;
        }

        res.send(result);

    }

    /**
     * Erstellt einen neuen Benutzer
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
        let id = parseInt(req.params.id);
        if(!Number.isInteger(id))
        {
            res.sendStatus(400);
            return;   
        }

        let status;
        if(req.body.status === true)
            status = true;
        else if(req.body.status === false)
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
        if(result === undefined)
        {
            res.sendStatus(400);
            return;
        }

        if(result)
        {
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    }

    /**
     * Ändert das Passwort eines Benutzers
     * @param req 
     * @param res 
     */
    async resetPassword(req: Request, res: Response)
    {
        let id = parseInt(req.params.id);
        if(!Number.isInteger(id))
        {
            res.sendStatus(400);
            return;   
        }
        let newPassword = req.body.password;

        let result,err;
        [result,err] = await resolve(UserMapper.resetPassword(id,newPassword));

        if(err !== null)
        {
            res.sendStatus(500);
            return;            
        }

        res.sendStatus(result);

    }

    /**
     * Gibt die Berechtigungen eines Benutzers
     * @param req 
     * @param res 
     */
    async getPermission(req: Request, res: Response){
        let id = parseInt(req.params.id);
        if(!Number.isInteger(id))
        {
            res.sendStatus(400);
            return;   
        }
        let result = await UserMapper.getUserPermission(id);
        if(result === undefined){
            res.sendStatus(404);
            return;
        }
        res.send(result);
    }
}


