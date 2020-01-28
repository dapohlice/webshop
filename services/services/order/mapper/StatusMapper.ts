import {StatusEntity} from '../entity/StatusEntity' 

/**
 * Gibt alle Status zurück
 */
export async function getAllStatus()
{
    return await StatusEntity.find();
}



