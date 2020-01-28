import {Router,Request,Response} from "express";

import * as OrderMapper from "../mapper/OrderMapper";
import {BaseRouter} from "./BaseRouter";

/**
 * express Router für Bestellungen
 */
export default class OrderRouter extends BaseRouter{

    initialiseRouter(){
        this.router.get('/',this.get);
        this.router.get('/status/:status',this.getByStatus);
        this.router.get('/:id',this.getOneFull);
        this.router.patch('/:id',this.setStatus);
    }
    /**
     * Gibt alle Bestellungen zurück
     * @param req 
     * @param res 
     */
    async get(req: Request, res: Response)
    {
        res.json(
            await OrderMapper.getAllOrders()
        );
    }

    /**
     * Gibt alle Bestellungen eines Statuses zurück
     * @param req 
     * @param res 
     */
    async getByStatus(req: Request, res: Response)
    {
        let statusId = parseInt(req.params.status);
        if(!Number.isInteger(statusId))
        {
            res.sendStatus(400);
            return;   
        }

        res.json(
            await OrderMapper.getAllOrdersByStatus(statusId)
        );
    }

    /**
     * Gibt einen kompletten Status zurück
     * @param req 
     * @param res 
     */
    async getOneFull(req: Request, res: Response)
    {
        let id = parseInt(req.params.id);
        if(!Number.isInteger(id))
        {
            res.sendStatus(400);
            return;   
        }

        res.json(
            await OrderMapper.getFullOrder(id)
        );
    }

    /**
     * setzt den Status einer Bestellung
     * @param req 
     * @param res 
     */
    async setStatus(req: Request, res: Response)
    {
        let id = parseInt(req.params.id);
        let info = req.body.info;
        let status = req.body.status;
        
        if(!Number.isInteger(id))
        {
            res.sendStatus(400);
            return;   
        }

        if(!status)
        {
            let result = await OrderMapper.setNextStatus(id,info);
            if(result == false)
            {
                res.sendStatus(400);
                return;
            }
            res.json(result);
            return;
        }

        res.json(await OrderMapper.setStatus(id,info,status));
    }

}


