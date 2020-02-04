import * as StatusMapper from "../mapper/StatusMapper"
import {Request,Response} from "express";
import {BaseRouter} from "./BaseRouter";
import resolve from '../resolver'

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
        let status,err;

        [status,err] = await resolve(StatusMapper.getAllStatus());
        if(err !== null || status === undefined)
        {
            res.sendStatus(500);
            return;
        }
        
        res.json(
            status
        );
    }
}


