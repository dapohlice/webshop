import {getRepository} from "typeorm";
import {OrderEntity} from '../entity/OrderEntity' 
import * as OrderLog from './OrderLogMapper' 
import {StatusEntity} from '../entity/StatusEntity' 

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
    let orders = orderRep.createQueryBuilder("order")
    .leftJoinAndSelect("order.status", "status")
    .leftJoinAndSelect("order.address", "address")
    .leftJoinAndSelect("order.logs", "logs")
    .leftJoinAndSelect("logs.status", "logsstatus")
    .leftJoinAndSelect("order.articles", "articles")
    .leftJoinAndSelect("articles.article", "article")
    .where("order.id = :id",{id: orderId})
    .getOne();
    return orders;
}

/**
 * setzt den nächsten Status einer Bestellung
 * @param orderId Bestellungsid
 * @param info Zusatzinformation
 */
export async function setNextStatus(orderId: number ,info: string)
{
    const orderRep = getRepository(OrderEntity)
    let order = await orderRep.createQueryBuilder("order")
    .leftJoinAndSelect("order.status", "status")
    .leftJoinAndSelect("status.next", "next")
    .where("order.id = :id",{id: orderId})
    .getOne();

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
        if(log == false)
        {
            throw new Error("Failed creating log");
        }
        try{
            let res = await order.save();
        }catch(error)
        {
            console.error(error);
            //todo: delete
            throw error;
        }
        
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
export async function setStatus(orderId: number ,info: string, statusId: number)
{
    return false;
}
