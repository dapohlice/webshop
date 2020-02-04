import {Router} from "express";
/**
 * Basisrouter für Express in Typescript
 */
export abstract class BaseRouter{
    protected router: Router;

    constructor(){
        this.router = Router();
        this.initialiseRouter();
    }

    /**
     * erstellt den express Router
     */
    abstract initialiseRouter():void;

    /**
     * gibt den express Router zurück
     */
    getRouter():Router{
        console.log("get Router");
        return this.router;
    }
}