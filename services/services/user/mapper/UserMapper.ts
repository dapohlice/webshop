import {getRepository} from "typeorm";
import {UserEntity} from '../entity/UserEntity' 
import * as Password from "./Password";
import resolve from '../resolver';

/**
 * gibt alle Benutzer zurück
 * @returns Liste der Benutzer
 */
export async function getAllUsers()
{
    const userRep = getRepository(UserEntity)
    let users = await userRep
        .createQueryBuilder("user")
        .select([
            "user.id",
            "user.firstname",
            "user.lastname"
            ])
        .getMany();
    return users;
}

/**
 * Gibt einen Benutzer zurück
 * @param userId Benutzer-Id
 * @returns Benutzer
 */
export async function getOneUser(userId: number)
{
    if(isNaN(userId) || userId === undefined)
        return undefined;
    const userRep = getRepository(UserEntity)
    let users = await userRep
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.groups", "group")
        .where("user.id = :id",{id: userId})
        .getOne();
    return users;
}


/**
 * Erstellt einen neuen Benuter
 * @param firstname Vorname
 * @param lastname Nachname
 * @param mail E-Mail
 * @returns undefined | User
 */
export async function createUser(
    firstname:string, 
    lastname: string,
    mail: string
)
{ 
    let password = Password.createRandomPassword();
    let pword = await Password.hashPassword(password);

    let user = new UserEntity();
    user.mail = mail;
    user.firstname = firstname;
    user.lastname = lastname;
    user.pword = pword;
    
    let result,err;
    [result,err] = await resolve(user.save());
    if(err != null)
        return undefined;
    
    result.pword = password;
    return result;
}

/**
 * Ändert einen Benutzer
 * @param userId Benutzer-Id
 * @param firstname Vorname
 * @param lastname Nachname
 * @param mail E-Mail
 * @returns undefined | User
 */
export async function changeUser(
    userId: number,
    firstname:string, 
    lastname: string,
    mail: string
)
{ 

    let user = await UserEntity.findOne({id: userId});
    if(user === undefined)
        return undefined;
    
    if(mail != undefined)
        user.mail = mail;

    if(firstname != undefined)
        user.firstname = firstname;

    if(lastname != undefined)
        user.lastname = lastname;
    
    let result,err;
    [result,err] = await resolve(user.save());
    if(err != null)
        return undefined;
    
    return result;
}

/**
 * Ändert das Passwort eines Benutzers
 * @param userId Benutzer-Id
 * @param oldPassword Altes Passwort
 * @param newPassword Neues Passwort
 * @returns HttpResponseCode
 */
export async function changePassword(
    userId: number,
    oldPassword: string, 
    newPassword: string
): Promise<number>
{
    const userRep = getRepository(UserEntity)
    let user = await userRep
        .createQueryBuilder("user")
        .addSelect("user.pword")
        .where("user.id = :id",{id: userId})
        .getOne();
    console.log(user);

    if(user === undefined)
        return 404;
    
    if(!await Password.comparePassword(oldPassword,user.pword))
        return 401;

    if(!Password.checkPassword(newPassword))
        return 400;
    
    let password = await Password.hashPassword(newPassword);
    user.pword = password;

    let result,err;
    [result,err] = await resolve(user.save());
    if(err != null)
        return 500;
    return 200;
}
/**
 * Ändert den Status eines Benutzers
 * @param userId Benutzer-Id
 * @param status Status
 * @return undefined | true | false
 */
export async function changeStatus(userId: number, status: boolean)
{
    let user = await UserEntity.findOne({id: userId});
    console.log(user);
    
    if(user === undefined)
        return undefined;
    
    user.status = status;
    
    let result,err;
    [result,err] = await resolve(user.save());
    console.log(err);
    
    if(err != null)
        return false;
    return true;
}

export async function getUserPermission(userId: number)
{
    const userRep = getRepository(UserEntity)
    let user = await userRep
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.groups", "group")
        .where("user.id = :id",{id: userId})
        .getOne();
    let result = {
        auth_user: false,
        auth_product: false,
        auth_group: false,
        auth_normalOrders: false,
        auth_allOrders: false
    }
    user.groups.forEach(element => {
        result.auth_user = result.auth_user || element.auth_user;
        result.auth_product = result.auth_product || element.auth_product;
        result.auth_group = result.auth_group || element.auth_group;
        result.auth_normalOrders = result.auth_normalOrders || element.auth_normalOrders;
        result.auth_allOrders = result.auth_allOrders || element.auth_allOrders;
    });
    return result;

}