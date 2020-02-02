import {getRepository} from "typeorm";
import {AddressEntity} from '../entity/AddressEntity' 


/**
 * Erstellt eine neue Adresse
 * @param address: Adresse
 * @returns Addressdatensatz
 */
export async function createAddress(address):Promise<AddressEntity>
{
    if(
        !address.firstname || 
        !address.lastname || 
        !address.street || 
        !address.streetnumber || 
        !address.plz || 
        !address.town || 
        !address.country
        )
    {
        return undefined;
    }

    let entity = new AddressEntity();
    entity.firstname = address.firstname;
    entity.lastname = address.lastname;
    entity.street = address.street;
    entity.streetnumber = address.streetnumber;
    entity.plz = address.plz;
    entity.town = address.town;
    entity.state = address.state;
    entity.country = address.country;
    return entity.save();
}

