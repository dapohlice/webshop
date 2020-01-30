import {getRepository} from "typeorm";
import {OrderEntity} from '../entity/OrderEntity' 
import * as OrderLog from './OrderLogMapper' 
import {StatusEntity} from '../entity/StatusEntity' 
import * as Convert from './Converter';

/**
 * gibt alle Bestellungen mit Status zurück
 */
export async function getAllOrders()
{
    const orderRep = getRepository(OrderEntity)
    let orders = await orderRep.createQueryBuilder("order")
    .leftJoinAndSelect("order.status", "status")
    .getMany();
    return orders;
}
/**
 * gibt alle Bestellungen eines Status zurück
 * @param statusId status Id
 */
export async function getAllOrdersByStatus(statusId: number)
{
    const orderRep = getRepository(OrderEntity)
    let orders = await orderRep.createQueryBuilder("order")
    .leftJoin("order.status", "status")
    .where("status.id = :id",{id: statusId})
    .getMany();
    
    return orders;
}

/**
 * Gibt alle Daten einer Bestellung zurück
 *  Inklusive:
 *      - status
 *      - address
 *      - logs
 *      - articles
 * @param orderId Bestellungsid
 */
export async function getFullOrder(orderId: number)
{
    const orderRep = getRepository(OrderEntity)
    let order = await orderRep.createQueryBuilder("order")
    .leftJoinAndSelect("order.status", "status")
    .leftJoinAndSelect("order.address", "address")
    .leftJoinAndSelect("order.logs", "logs")
    .leftJoinAndSelect("logs.status", "logsstatus")
    .leftJoinAndSelect("order.articles", "articles")
    .leftJoinAndSelect("articles.article", "article")
    .where("order.id = :id",{id: orderId})
    .getOne();

    let result = 
    {
        id:order.id,
        mail: order.mail,
        status: order.status.name,
        address: order.address,
        logs: Convert.PrettiefyLogs(order.logs),
        article: Convert.PrettiefyArticles(order.articles)
    }


    return result;
}

/**
 * setzt den nächsten Status einer Bestellung
 * @param orderId Bestellungsid
 * @param info Zusatzinformation
 */
export async function setNextStatus(orderId: number ,info: string):Promise<boolean>
{
    const orderRep = getRepository(OrderEntity)
    let order = await orderRep.createQueryBuilder("order")
    .leftJoinAndSelect("order.status", "status")
    .leftJoinAndSelect("status.next", "next")
    .where("order.id = :id",{id: orderId})
    .getOne();

    if(order == undefined)
        return false;

    if(order.status.needsPermission)
    {
        //todo permission checking
        console.error("No Permisiion Checking in OrderMapper setNextStatus");
    }

    let nextStatus = order.status.next;

    if(nextStatus != null)
    {
        order.status = nextStatus;
        let log = await OrderLog.createLog(order,info,nextStatus);
        if(log == undefined)
            return false;
        
        let res = await order.save();
        if(res == undefined)
            return false;        
    }else{
        return false;
    }

    return true;

}

/**
 * Setzt den Status einer Bestellung
 * @param orderId Bestellungsid
 * @param info Zusatzinformation
 * @param statusId Statusid
 */
export async function setStatus(orderId: number ,info: string, statusId: number):Promise<boolean>
{
    const orderRep = getRepository(OrderEntity)
    let order = await orderRep.createQueryBuilder("order")
    .leftJoinAndSelect("order.status", "status")
    .where("order.id = :id",{id: orderId})
    .getOne();

    if(order == undefined)
        return false;

    if(order.status.needsPermission)
    {
        //todo permission checking
        console.error("No Permisiion Checking in OrderMapper setNextStatus");
    }
    const newStatus = await StatusEntity.findOne({where: {id: statusId}});
    if(newStatus == undefined)
        return false;
    
    order.status = newStatus;

    let log = await OrderLog.createLog(order,info,newStatus);
    if(log == undefined)
        return false;


    let res = await order.save();
    if(res == undefined)
    {
        //todo: delte log
        return false;
    }
    
    return true;
}
