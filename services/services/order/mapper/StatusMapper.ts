import {StatusEntity} from '../entity/StatusEntity' 

/**
 * Gibt alle Status zurück
 * @returns alle Stadien | undefined
 */
export async function getAllStatus()
{
    return await StatusEntity.find();
}



