import {Request,Response} from "express";

import * as OrderMapper from "../mapper/OrderMapper";
import {BaseRouter} from "./BaseRouter";

function hasFullPermission(jwt):boolean
{
    if(
        jwt === undefined || 
        jwt.auth === undefined || 
        jwt.auth.auth_allOrders === undefined
    )
        return false;
    return jwt.auth.auth_allOrders;
}

/**
 * express Router für Bestellungen
 */
export default class OrderRouter extends BaseRouter{

    constructor(){
        super(true);
    }

    initialiseRouter(){
        this.router.use(this.checkPermission)
        this.router.get('/',this.get);
        this.router.get('/status/finished',this.getByFinishStatus);
        this.router.get('/status/returned',this.getByReturnStatus);
        this.router.get('/status/:status',this.getByStatus);
        this.router.get('/:id',this.getOneFull);
        this.router.patch('/:id',this.setStatus);
        
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
            req.jwt.auth.auth_auth_normalOrders === true
        )
            next();
        else
            res.sendStatus(403);
    }

    /**
     * Gibt alle Bestellungen zurück
     * @param req 
     * @param res 
     */
    async get(req: Request, res: Response)
    {
        let status,orders;
        [status,orders] = await OrderMapper.getAllOrders(hasFullPermission(req.jwt));
        if(status !== 200)
        {
            res.sendStatus(status);
        }else{
            res.json(
                orders
            );
        }

        
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


        let status,result;
        [status,result] = await OrderMapper.getAllOrdersByStatus(statusId,hasFullPermission(req.jwt));
        if(status !== 200)
        {
            res.sendStatus(status)
        }else{
            res.json(
                result
            );
        }

        
    }

    /**
     * Gibt alle Bestellungen die Zurückgeben wurden
     * @param req 
     * @param res 
     */
    async getByReturnStatus(req: Request, res: Response)
    {
        let result;
        result = await OrderMapper.getAllOrdersByMultiplyStatus([6,7,8]);
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
     * Gibt alle Bestellungen die Fertig sind zurück
     * @param req 
     * @param res 
     */
    async getByFinishStatus(req: Request, res: Response)
    {
        let result;
        result = await OrderMapper.getAllOrdersByMultiplyStatus([4,5,9]);

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

        let status,result;
        [status,result] = await OrderMapper.getFullOrder(id, hasFullPermission(req.jwt));
        if(status !== 200)
        {
            res.sendStatus(status)
        }else{
            res.json(
                result
            );
        }

        
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
        let result;

        if(!status)
        {
            result = await OrderMapper.setNextStatus(id,info,hasFullPermission(req.jwt));
        }else{
            result = await OrderMapper.setStatus(id,info,status,hasFullPermission(req.jwt));
        }

        res.sendStatus(result);

    }

}


