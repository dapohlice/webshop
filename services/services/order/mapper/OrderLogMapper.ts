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
        let log = new OrderLogEntity();
        log.info = info;
        log.order = order;
        log.user = "dummy";
        log.status = status;
        return log.save();  
}


