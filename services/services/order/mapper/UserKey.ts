import {getAllCreatedOrders,deleteOrder} from "./OrderMapper";
import {OrderEntity} from "../entity/OrderEntity";


class OrderMapping{
    id: number;
    timestamp: Date;
    
    constructor(id: number)
    {
        this.id = id;
        this.timestamp = new Date;
    }
}


var customerOrderMap: Map<string,OrderMapping> = new Map<string,OrderMapping>();
/**
 * Zeit in der das Mapping überprüft wird in Millisekunden
 */
const KEY_REFRESH_TIME = 1000;
/**
 * Lebensspanne eines Mappings in Millisekunden
 */
const KEY_LIFESPAN = 3600000;

export function addOrder(orderId: number):string
{
    let mapping = new OrderMapping(orderId) 
    let userkey;
    do{
        userkey = Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15);
    }while(customerOrderMap.has(userkey));

    customerOrderMap.set(userkey,mapping);

    return userkey;
}

function checkMapping(mapping: OrderMapping, time: Date): boolean
{
    let diff = time.getTime() - mapping.timestamp.getTime();    

    if(diff > KEY_LIFESPAN)
    {
        return false;
    }
    return true;
}

async function check(){
    let orders = await getAllCreatedOrders();
    let oldOrders = new Map<number,OrderEntity>();
    let now = new Date();

    for(let i = 0; i < orders.length; i++)
    {
        let order = orders[i];
        let diff = now.getTime() - order.timestamp.getTime();
        if(diff > KEY_LIFESPAN)
        {
            oldOrders.set(order.id,order);
        }
    }

    customerOrderMap.forEach(async (value,key)=>{
        if(!checkMapping(value,now))
        {
            let order = oldOrders.get(value.id);
            await deleteOrder(order);
            oldOrders.delete(value.id);
            customerOrderMap.delete(key);
        }
    });

}

export function getOrder(userkey: string): number
{
    let mapping = customerOrderMap.get(userkey);
    console.log("get mapping")
    if(mapping === undefined)
        return undefined;

    if(!checkMapping(mapping,new Date()))
    {
        return undefined;
    }

    customerOrderMap.delete(userkey);
    return mapping.id;
}
