import {Router,Request,Response} from "express";

import * as OrderMapper from "../mapper/OrderMapper";
import {BaseRouter} from "./BaseRouter";
import {createAddress} from "../mapper/AddressMapper"
import {addArticle, createArticle} from "../mapper/ArticleMapper"
import { OrderEntity } from "../entity/OrderEntity";
import * as UserKey from "../mapper/UserKey";

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

        let address = await createAddress(req.body.address);

        if(address == undefined)
        {
            res.sendStatus(500);
            return;
        }
        
        let order = await OrderMapper.createOrder(req.body.mail,address);
        if(order == undefined)
        {
            res.sendStatus(500);
            return;
        }

        let savedArticles = [];
        let articles = req.body.articles;
        for(let i = 0; i < articles.length; i++)
        {
            if(
                (!articles[i].amount && Number.isInteger(articles[i].amount)) ||
                (!articles[i].articleId && Number.isInteger(articles[i].articleId)) ||
                (!articles[i].subarticleId && Number.isInteger(articles[i].subarticleId))
            ){
                continue;
            }
            let createdArticle = await addArticle(articles[i].amount,articles[i].articleId,articles[i].subarticleId,order);
            savedArticles.push(createdArticle);
        }

        let user_key = UserKey.addOrder(order.id);

        res.send({
            mail: order.mail,
            address: order.address,
            articles: savedArticles,
            user_key: user_key
        });
    }

    async submitOrder(req: Request, res: Response)
    {
        console.log("submit Order");

        let user_key = req.body.user_key;

        let order_id = UserKey.getOrder(user_key);
        if(order_id === undefined)
        {
            res.sendStatus(400);
            return;
        }

        if(await OrderMapper.setStatus(order_id,undefined,1))
        {
            res.sendStatus(200);
        }else{
            res.sendStatus(500);
        }
    }

}


