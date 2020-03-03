import {getRepository} from "typeorm";
import {OrderEntity} from '../entity/OrderEntity' 
import * as OrderLog from './OrderLogMapper' 
import {StatusEntity} from '../entity/StatusEntity' 
import * as Convert from './Converter';
import { AddressEntity } from "../entity/AddressEntity";
import * as UserKey from "./UserKey";
import {createAddress} from "../mapper/AddressMapper"
import {addArticle, createArticle} from "../mapper/ArticleMapper"
import resolve from "../resolver";

const permissionFreeStatus = [1,2,3,6,7,8];

function checkStatusByPermission(statusID: number):boolean
{
    permissionFreeStatus.forEach(element => {
        if(element === statusID)
            return true;
    });
    return false;
}

/**
 * gibt alle Bestellungen mit Status zurück
 * @param hasFullPermission hat der Abrufende die Berechtigung für alle Datensätze
 * @returns Liste mit Bestellungen
 */
export async function getAllOrders(hasFullPermission: boolean):Promise<[number,any]>
{
    const orderRep = getRepository(OrderEntity)
    let builder = orderRep.createQueryBuilder("order")
        .leftJoinAndSelect("order.status", "status");
    if(!hasFullPermission)
        builder.where("order.status IN (1,2,3,6,7,8)")

    let orders,err;
    [orders,err] = await resolve(builder.getMany());
    if(orders === undefined)
        return [404,null]
    if(err !== null)
        return [500,null];

    return [200,Convert.PrettiefyOrders(orders)];
}
/**
 * gibt alle Bestellungen eines Status zurück
 * @param statusId status Id
 * @param hasFullPermission hat der Abrufende die Berechtigung für alle Datensätze
 * @returns Alle Bestellungen eines Statuses
 */
export async function getAllOrdersByStatus(statusId: number,hasFullPermission:boolean):Promise<[number,OrderEntity]>
{
    if(!hasFullPermission && !checkStatusByPermission(statusId))
    {
        return [403,null];   
    }
    const orderRep = getRepository(OrderEntity)
    let builder = orderRep.createQueryBuilder("order")
        .leftJoin("order.status", "status")
        .where("status.id = :id",{id: statusId});
    
    let orders,err;
    [orders,err] = await resolve(builder.getMany());
    if(err !== null)
    {
        return [500,null];
    }
    if(orders === undefined)
    {
        return [404,null];
    }
    return [200,orders];
}

/**
 * gibt alle Bestellungen eines Status zurück
 * @param statusId status Id
 * @returns Alle Bestellungen eines Statuses
 */
export async function getAllOrdersByMultiplyStatus(statusId: number[])
{
    if(statusId.length < 1)
        throw new Error("It musst be at least one Status Id given.")
    const orderRep = getRepository(OrderEntity)
    let builder = orderRep.createQueryBuilder("order")
        .leftJoinAndSelect("order.status", "status")
        .where("status.id IN (:id)",{id: statusId})
    
    let orders,err
    [orders,err] = await resolve(builder.getMany());
    if(err !== null || orders === undefined)
        return undefined;
    return Convert.PrettiefyOrders(orders);
}

/**
 * Gibt alle Daten einer Bestellung zurück
 *  Inklusive:
 *      - status
 *      - address
 *      - logs
 *      - articles
 * @param orderId Bestellungsid
 * @param hasFullPermission hat der Abrufende die Berechtigung für alle Datensätze
 * @returns Wesentliche Informationen über eine Bestellung | undefined
 */
export async function getFullOrder(orderId: number,hasFullPermission: boolean):Promise<[number,any]>
{
    const orderRep = getRepository(OrderEntity)
    let builder = orderRep.createQueryBuilder("order")
        .leftJoinAndSelect("order.status", "status")
        .leftJoinAndSelect("order.address", "address")
        .leftJoinAndSelect("order.logs", "logs")
        .leftJoinAndSelect("logs.status", "logsstatus")
        .leftJoinAndSelect("order.articles", "articles")
        .leftJoinAndSelect("articles.article", "article")
        .where("order.id = :id",{id: orderId});

    let order,err = await resolve(builder.getOne());

    if(order === undefined)
        return [404,null];
    if(err !== null)
    {
        return [500,null];
    }

    if(!hasFullPermission && !checkStatusByPermission(order.status.id))
    {
        return [403,null];   
    }

    return [200,{
        id:order.id,
        mail: order.mail,
        status: order.status.id,
        address: order.address,
        logs: Convert.PrettiefyLogs(order.logs),
        article: Convert.PrettiefyArticles(order.articles)
    }];
}

/**
 * setzt den nächsten Status einer Bestellung
 * @param orderId Bestellungsid
 * @param info Zusatzinformation
 * @param hasFullPermission hat der Abrufende die Berechtigung für alle Datensätze
 * @returns false: Fehlerhaft | true: nächster Status gesätzt
 */
export async function setNextStatus(orderId: number ,info: string,hasFullPermission: boolean):Promise<number>
{
    const orderRep = getRepository(OrderEntity)
    let order = await orderRep.createQueryBuilder("order")
    .leftJoinAndSelect("order.status", "status")
    .leftJoinAndSelect("status.next", "next")
    .where("order.id = :id",{id: orderId})
    .getOne();

    if(order == undefined)
        return 404;

    if(order.status.needsPermission && !hasFullPermission)
    {
        return 403;
    }

    let nextStatus = order.status.next;

    if(nextStatus != null)
    {
        order.status = nextStatus;
        let log = await OrderLog.createLog(order,info,nextStatus);
        if(log == undefined)
            return 500;
        
        let res = await order.save();
        if(res == undefined)
            return 500;        
    }else{
        return 500;
    }

    return 200;

}

/**
 * Setzt den Status einer Bestellung
 * @param orderId Bestellungsid
 * @param info Zusatzinformation
 * @param statusId Statusid
 * @param hasFullPermission hat der Abrufende die Berechtigung für alle Datensätze
 */
export async function setStatus(orderId: number ,info: string, statusId: number,hasFullPermission:boolean):Promise<number>
{
    if(statusId === 0)
        return 400;

    const orderRep = getRepository(OrderEntity)
    let order = await orderRep.createQueryBuilder("order")
    .leftJoinAndSelect("order.status", "status")
    .where("order.id = :id",{id: orderId})
    .getOne();

    if(order === undefined)
        return 404;

    if(order.status.needsPermission && !hasFullPermission)
    {
        return 403;
    }
    const newStatus = await StatusEntity.findOne({where: {id: statusId}});
    if(newStatus === undefined)
        return 404;
    
    order.status = newStatus;

    let log,err;
    [log,err] = await resolve(OrderLog.createLog(order,info,newStatus));
    if(log === undefined)
    {
        console.error(`Failed creating Log in OrderMapper:setStatus for: ${order.id},${newStatus.id}`)
        return 500;
    }
        


    let res = await order.save();
    if(res === undefined)
    {
        console.error(`Failed creating saving Order in OrderMapper:setStatus for: ${order.id}`)
        if(log.remove() === undefined)  
        {
            console.error(`Failed deleting Log after failing detling Order in OrderMapper:setStatus for: ${order.id}`)
        }

        return 500;
    }
    
    return 200;
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
        let createdArticle = await addArticle(articles[i],order);
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
export async function submitOrder(user_key: string):Promise<number>
{
    let order_id = UserKey.getOrder(user_key);
    if(order_id === undefined)
        return 400;

    return await setStatus(order_id,"",1,true);
}