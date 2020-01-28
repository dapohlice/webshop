import {getRepository} from "typeorm";
import {OrderEntity} from '../entity/OrderEntity' 
import {StatusEntity} from '../entity/StatusEntity' 
import {OrderLogEntity} from '../entity/OrderLogEntity' 

/**
 * Erstellt ein Bestelllogeintrag
 * @param order Bestellung
 * @param info Zusatzinformation
 * @param status Status
 */
export async function createLog(order: OrderEntity, info: string, status: StatusEntity)
{
    try{
        let log = new OrderLogEntity();
        log.info = info;
        log.order = order;
        log.user = "dummy";
        log.status = status;
        return await log.save();
    }catch(error)
    {
        console.error(error);
        return false;
    }
    
}


