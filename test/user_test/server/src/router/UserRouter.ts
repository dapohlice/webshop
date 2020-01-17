import {Router,Request,Response} from "express";

import * as UserMapper from "../mapper/UserMapper";
import BaseRouter from "./BaseRouter";

export default class UserRouter extends BaseRouter{

    initialiseRouter(){
        this.router.get('/',this.get);
        this.router.get('/:id',this.getById);
        this.router.post('/',this.post);
        this.router.put('/:id',this.put);
        this.router.delete('/:id',this.delete);
    }

    async get(req: Request, res: Response)
    {
        res.json(
            await UserMapper.GetAllUsers()
        );
    }

    /**
     * params: id
     */
    async getById(req: Request, res: Response)
    {
        if(isNaN(req.params.id)){
            res.status(400).end();
            return;
        }
        res.json(
            await UserMapper.GetUser(req.params.id)
        );
    }

    async post(req: Request, res: Response)
    {
        let user = req.body;
        if(
            user["firstName"] != undefined &&
            user["lastName"] != undefined &&
            user["age"] != undefined
        ){
            res.status(400).end();
            return;
        }
            
        res.json(
            await UserMapper.CreateUser(user["firstName"],user["lastName"],user["age"])
        );
    }

    async put(req: Request, res: Response, next)
    {
        let user = req.body;
        if(
            user["firstName"] == undefined ||
            user["lastName"] == undefined ||
            user["age"] == undefined
        ){
            res.status(400).end();
            return;
        }

        UserMapper.ChangeUser(req.params.id,user["firstName"],user["lastName"],user["age"])
        .then((value)=>{res.json(value)})
        .catch(next)
    }

    async delete(req: Request, res: Response)
    {
        if(isNaN(req.params.id)){
            res.status(400).end();
            return;
        }
        res.json(
            await UserMapper.DeleteUser(req.params.id)
        );
    }

}


