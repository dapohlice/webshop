import * as StatusMapper from "../mapper/StatusMapper"
import {Router,Request,Response} from "express";
import * as OrderMapper from "../mapper/OrderMapper";
import {BaseRouter} from "./BaseRouter";

/**
 * express Router für Bestellungen
 */
export default class StatusRouter extends BaseRouter{

    initialiseRouter(){
        this.router.get('/',this.get);
    }
    /**
     * Gibt alle Statuse zurück
     * @param req 
     * @param res 
     */
    async get(req: Request, res: Response)
    {
        let status = await StatusMapper.getAllStatus();
        res.json(
            status
        );
    }
}


