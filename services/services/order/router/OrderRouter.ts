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
        this.router.post('/submit',this.submitOrder);
        this.router.patch('/:id',this.setStatus);
        this.router.post('/',this.createOrder);
        
    }
    /**
     * Gibt alle Bestellungen zurück
     * @param req 
     * @param res 
     */
    async get(req: Request, res: Response)
    {
        let orders = await OrderMapper.getAllOrders()
        let result = [];
        orders.forEach(order => {
            result.push({
                id: order.id,
                mail: order.mail,
                timestamp: order.timestamp,
                status: order.status.id
            });
        });
        res.json(
           result
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

        let result = await OrderMapper.getAllOrdersByStatus(statusId);
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
     * Gibt eine komplette Bestellung zurück
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

        let result = await OrderMapper.getFullOrder(id);

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
        try{
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
            let res_status = await OrderMapper.setStatus(id,info,status);
            if(res_status==false)
            {
                res.sendStatus(400);
                return;
            }
            res.json(res_status);
        }catch(error)
        {
            res.sendStatus(500);
        }
    }

    /**
     * Erstellt eine neue Bestellung
     * @param req 
     * @param res 
     */
    async createOrder(req: Request, res: Response)
    {
        if(
            !req.body.mail ||
            !req.body.address ||
            (!req.body.articles && !Array.isArray(req.body.articles))
        )
        {
            res.sendStatus(400);
            return;
        }

        let result = await OrderMapper.addOrder(req.body.mail,req.body.address,req.body.articles);
        
        if(result === undefined)
        {
            res.sendStatus(400);
        }

        res.send(result);
    }

    /**
     * Bestätigt eine Bestellung
     * @param req 
     * @param res 
     */
    async submitOrder(req: Request, res: Response)
    {
        console.log("submit Order");

        let user_key = req.body.user_key;

        
        if(OrderMapper.submitOrder(user_key))
        {
            res.sendStatus(400);
            return;
        }
    }

}


