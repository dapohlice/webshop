import {Router,Request,Response} from "express";

export default abstract class BaseRouter{
    protected router: Router;

    constructor(){
        this.router = Router();
        this.initialiseRouter();
    }

    abstract initialiseRouter():void;

    getRouter(){
        return this.router;
    }
}