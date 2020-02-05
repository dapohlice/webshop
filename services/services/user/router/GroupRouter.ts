import {Request,Response} from "express";

import * as GroupMapper from "../mapper/GroupMapper";
import {BaseRouter} from "./BaseRouter";
import resolve from '../resolver';


/**
 * express Router für Bestellungen
 */
export default class GroupRouter extends BaseRouter{

    constructor()
    {
        super(true);
    }

    initialiseRouter(){
        this.router.get('/',this.get);
        this.router.post('/',this.create);
        this.router.get('/:id',this.getOne);
        this.router.delete('/:id',this.delete);
        this.router.patch('/:id/add',this.addUser);
        this.router.patch('/:id/remove',this.removeUser);
        this.router.use(this.checkPermission)
    }

    checkPermission(req,res,next)
    {
        if(this.getJwt().auth.auth_user === true)
            next();
        res.sendStatus(403);
    }

    /**
     * Gibt alle Bestellungen zurück
     * @param req 
     * @param res 
     */
    async get(req: Request, res: Response)
    {
        let orders,err;
        [orders,err] = await resolve(GroupMapper.getAllGroups());
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
        [result,err] = await resolve(GroupMapper.getOneGroup(id));
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
     * Erstellt eine neue Bestellung
     * @param req 
     * @param res 
     */
    async create(req: Request, res: Response)
    {
        let name = req.body.name;
        if(!name)
        {
            res.sendStatus(400);
            return;
        }

        let result,err;
        [result,err] = await resolve(GroupMapper.createGroup(name));
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
     * Gibt eine komplette Bestellung zurück
     * @param req 
     * @param res 
     */
    async delete(req: Request, res: Response)
    {
        let id = parseInt(req.params.id);
        if(!Number.isInteger(id))
        {
            res.sendStatus(400);
            return;   
        }

        let result,err;
        [result,err] = await resolve(GroupMapper.deleteGroup(id));
        if(err !== null)
        {
            res.sendStatus(500);
            return;            
        }

        if(result)
        {
            res.sendStatus(200);
        }else{
            res.sendStatus(400);
        }
    }

    async change(req: Request, res: Response)
    {
        let groupId = parseInt(req.params.id);
        if(!Number.isInteger(groupId))
        {
            res.sendStatus(400);
            return;   
        }
        

    }

    async addUser(req: Request, res: Response)
    {
        let groupId = parseInt(req.params.id);
        if(!Number.isInteger(groupId))
        {
            res.sendStatus(400);
            return;   
        }
        let userId = parseInt(req.body.userId);
        if(!Number.isInteger(userId))
        {
            res.sendStatus(400);
            return;   
        }

        if(await GroupMapper.addUser(groupId,userId))
        {
            res.sendStatus(200);
        }else{
            res.sendStatus(400);
        }

    }
    async removeUser(req: Request, res: Response)
    {
        let groupId = parseInt(req.params.id);
        if(!Number.isInteger(groupId))
        {
            res.sendStatus(400);
            return;   
        }
        let userId = parseInt(req.body.userId);
        if(!Number.isInteger(userId))
        {
            res.sendStatus(400);
            return;   
        }

        if(await GroupMapper.removeUser(groupId,userId))
        {
            res.sendStatus(200);
        }else{
            res.sendStatus(400);
        }
    }

}


