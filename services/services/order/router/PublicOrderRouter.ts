import {Request,Response} from "express";

import * as OrderMapper from "../mapper/OrderMapper";
import {BaseRouter} from "./BaseRouter";
import resolve from '../resolver';


/**
 * express Router für Bestellungen
 */
export default class OrderRouter extends BaseRouter{

    constructor(){
        super(false);
    }

    initialiseRouter(){
        this.router.post('/submitOrder',this.submitOrder);
        this.router.post('/createOrder',this.createOrder);
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

        let result,err;
        [result,err] = await resolve(OrderMapper.addOrder(req.body.mail,req.body.address,req.body.articles));
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
     * Bestätigt eine Bestellung
     * @param req 
     * @param res 
     */
    async submitOrder(req: Request, res: Response)
    {
        let user_key = req.body.user_key;
        let result,err;
        
        [result,err] = await resolve(OrderMapper.submitOrder(user_key));

        if(err !== null)
        {
            res.sendStatus(500);
            return;            
        }

        res.sendStatus(result);

}


