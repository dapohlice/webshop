import {getRepository} from "typeorm";
import {OrderEntity} from '../entity/OrderEntity' 
import * as OrderLog from './OrderLogMapper' 
import {StatusEntity} from '../entity/StatusEntity' 
import * as Convert from './Converter';
import { AddressEntity } from "../entity/AddressEntity";
import * as UserKey from "./UserKey";
import {createAddress} from "../mapper/AddressMapper"
import {addArticle, createArticle} from "../mapper/ArticleMapper"

/**
 * gibt alle Bestellungen mit Status zurück
 * @returns Liste mit Bestellungen
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
 * @returns Alle Bestellungen eines Statuses
 */
export async function getAllOrdersByStatus(statusId: number):Promise<OrderEntity[]>
{
    if(statusId === 0)
        return [];
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
 * @returns Wesentliche Informationen über eine Bestellung | undefined
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

    if(order === undefined)
    {
        return undefined;
    }

    return {
        id:order.id,
        mail: order.mail,
        status: order.status.id,
        address: order.address,
        logs: Convert.PrettiefyLogs(order.logs),
        article: Convert.PrettiefyArticles(order.articles)
    }
}

/**
 * setzt den nächsten Status einer Bestellung
 * @param orderId Bestellungsid
 * @param info Zusatzinformation
 * @returns false: Fehlerhaft | true: nächster Status gesätzt
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
    if(statusId === 0)
        return false;

    const orderRep = getRepository(OrderEntity)
    let order = await orderRep.createQueryBuilder("order")
    .leftJoinAndSelect("order.status", "status")
    .where("order.id = :id",{id: orderId})
    .getOne();

    if(order === undefined)
        return false;

    if(order.status.needsPermission)
    {
        // TODO: permission checking
        console.error("No Permisiion Checking in OrderMapper setNextStatus");
    }
    const newStatus = await StatusEntity.findOne({where: {id: statusId}});
    if(newStatus === undefined)
        return false;
    
    order.status = newStatus;

    let log = await OrderLog.createLog(order,info,newStatus);
    if(log === undefined)
    {
        console.error(`Failed creating Log in OrderMapper:setStatus for: ${order.id},${newStatus.id}`)
        return false;
    }
        


    let res = await order.save();
    if(res === undefined)
    {
        console.error(`Failed creating saving Order in OrderMapper:setStatus for: ${order.id}`)
        if(log.remove() === undefined)  
        {
            console.error(`Failed deleting Log after failing detling Order in OrderMapper:setStatus for: ${order.id}`)
        }

        return false;
    }
    
    return true;
}

/**
 * Erstellt eine neue Bestellung
 * @param mail Kunden-Email
 * @param address Kunden-Adresse
 * @returns Bestellung | undefined
 */
async function createOrder(mail:string, address: AddressEntity)
{
    let status = await StatusEntity.findOne({id: 0});
       
    let order = new OrderEntity();
    order.mail = mail;
    order.status = status;
    order.address = address;
    let result = await order.save();
    return result;
}

/**
 * Erstellt eine neue Bestellung mit Adresse und den Artikeln
 * @param mail Kunden-E-Mail
 * @param address Kunden-Adresse
 * @param articles Bestellte Artikel 
 * @returns Wichtige Informationen einer Bestellung | undefined
 */
export async function addOrder(mail: string,address,articles){
    let address_entity = await createAddress(address);

    if(address_entity === undefined)
    {
        return undefined;
    }
    
    let order = await createOrder(mail,address_entity);
    if(order === undefined)
    {
        return undefined;
    }

    let savedArticles = [];
    for(let i = 0; i < articles.length; i++)
    {
        let createdArticle = await addArticle(articles[i].amount,order);
        savedArticles.push(createdArticle);
    }

    let user_key = UserKey.addOrder(order.id);

    return {
        mail: order.mail,
        address: order.address,
        articles: savedArticles,
        user_key: user_key
    };
}

/**
 * Bestätigt eine Bestellung
 * @param user_key Benutzer-Key
 * @returns true | false
 */
export async function submitOrder(user_key: string):Promise<boolean>
{
    let order_id = UserKey.getOrder(user_key);
    if(order_id === undefined)
        return false;

    return await setStatus(order_id,undefined,1);
}