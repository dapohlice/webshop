import {getRepository} from "typeorm";
import {StatusEntity} from '../entity/StatusEntity' 

/**
 * Gibt alle Status zurück
 * @returns alle Stadien | undefined
 */
export async function getAllStatus()
{

    let status = await getRepository(StatusEntity).createQueryBuilder("status")
        .leftJoinAndSelect("status.next", "next")
        .getMany();

    let result = [];
    status.forEach(data =>{
        let n = null
        if(data.next != undefined)
            n = data.next.id;
            
        result.push({
            id: data.id,
            name: data.name,
            next: n
        });
    })

    return result;
}



