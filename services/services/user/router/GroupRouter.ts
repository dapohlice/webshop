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
        super(false);
    }

    initialiseRouter(){
        this.router.get('/',this.get);
        this.router.post('/',this.create);
        this.router.get('/:id',this.getOne);
        this.router.delete('/:id',this.delete);
        this.router.put('/:id',this.change);
        this.router.patch('/:id/add',this.addUser);
        this.router.patch('/:id/remove',this.removeUser);
        //this.router.use(this.checkPermission)
    }

    /**
     * Überprüft die Berechtigung auf dem JWT-Token
     * @param req 
     * @param res 
     * @param next 
     */
    checkPermission(req,res,next)
    {
        if(
            req.jwt !== undefined &&
            req.jwt.auth.auth_group === true
        )
            next();
        else
            res.sendStatus(403);
    }

    /**
     * Gibt alle Gruppen zurück
     * @param req 
     * @param res 
     */
    async get(req: Request, res: Response)
    {
        let groups,err;
        [groups,err] = await resolve(GroupMapper.getAllGroups());
        if(err !== null || groups === undefined)
        {
            res.sendStatus(500);
            return;            
        }

        res.json(groups);
    }

    /**
     * Gibt eine Gruppe zurück
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

        res.json(result);
    }

    /**
     * Erstellt eine neue Gruppe
     * @param req 
     * @param res 
     */
    async create(req: Request, res: Response)
    {
        let name = req.body.groupname;
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
     * Löscht eine Gruppe
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

    /**
     * Ändert die Berechtigung einer Gruppe
     * @param req 
     * @param res 
     */
    async change(req: Request, res: Response)
    {
        let groupId = parseInt(req.params.id);
        if(!Number.isInteger(groupId))
        {
            res.sendStatus(400);
            return;   
        }
        let auth = {
            auth_allOrders: req.body.auth_allOrders,
            auth_group: req.body.auth_group,
            auth_normalOrders: req.body.auth_normalOrders,
            auth_product: req.body.auth_product,
            auth_user: req.body.auth_user
        } ;
        if(
            auth.auth_allOrders === undefined ||
            auth.auth_group === undefined ||
            auth.auth_normalOrders === undefined ||
            auth.auth_product === undefined ||
            auth.auth_user === undefined
        )
        {
            res.sendStatus(400);
            return;
        }
        let result,err;
        [result,err] = await resolve(GroupMapper.changeGroup(groupId,auth));
        if(result === undefined || err !== null)
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

    /**
     * Fügt einen Benutzer einer Gruppe hinzu
     * @param req 
     * @param res 
     */
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

    /**
     * Entfernt einen Benutzer aus einer Gruppe
     * @param req 
     * @param res 
     */
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


