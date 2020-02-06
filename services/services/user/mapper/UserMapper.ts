import {getRepository} from "typeorm";
import {UserEntity} from '../entity/UserEntity' 
import {IPermission} from './GroupMapper' 
import * as Password from "./Password";
import resolve from '../resolver';

/**
 * gibt alle Benutzer zurück
 * @returns Liste der Benutzer
 */
export async function getAllUsers()
{
    const userRep = getRepository(UserEntity)
    let users,err;
    [users,err] = await resolve(userRep
        .createQueryBuilder("user")
        .select([
            "user.id",
            "user.firstname",
            "user.lastname",
            "user.status"
            ])
        .getMany());
    if(err !== null)
        return undefined;
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
    let builder = userRep
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.groups", "group")
        .where("user.id = :id",{id: userId})
    let users,err
    [users,err] = await resolve(builder.getOne());
    if(err !== null)
        return undefined;
    return users;
}
/**
 * Gibt die Id oder Undefined zu einem Loginnamen
 * @param loginname Loginname
 */
export async function getUserIdByLoginname(loginname: string):Promise<number>
{
    const userRep = getRepository(UserEntity)
    let builder = userRep
        .createQueryBuilder("user")
        .select("user.id")
        .where("user.loginname = :name",{name: loginname});
    let user,err
    [user,err] = await resolve(builder.getOne());
    if(err !== null || user === undefined)
        return undefined;
    return user.id;
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
    if(err !== null)
        return undefined;
    
    

    [result,err] = await resolve (UserEntity.findOne({id: result.id}));
    if(result === undefined || err !== null)
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

    let user,err;
    [user,err] = await resolve(UserEntity.findOne({id: userId}));
    if(user === undefined || err !== null)
        return undefined;
    
    if(mail != undefined)
        user.mail = mail;

    if(firstname != undefined)
        user.firstname = firstname;

    if(lastname != undefined)
        user.lastname = lastname;
    
    [user,err] = await resolve(user.save());
    if(err != null)
        return undefined;
    
    return user;
}

/**
 * Ändert das Passwort eines Benutzers
 * @param userId Benutzer-Id
 * @param oldPassword Altes Passwort
 * @param newPassword Neues Passwort
 * @returns HttpStatusCode
 */
export async function changePassword(
    userId: number,
    oldPassword: string, 
    newPassword: string
): Promise<number>
{
    const userRep = getRepository(UserEntity)
    let builder = userRep
        .createQueryBuilder("user")
        .addSelect("user.pword")
        .where("user.id = :id",{id: userId});
    let user,err;
    [user,err] = await resolve(builder.getOne());

    if(err !== null)
        return 500;

    if(user === undefined)
        return 404;
    
    if(!await Password.comparePassword(oldPassword,user.pword))
        return 401;

    if(!Password.checkPassword(newPassword))
        return 400;
    
    let password = await Password.hashPassword(newPassword);
    user.pword = password;

    [user,err] = await resolve(user.save());
    if(err != null)
        return 500;
    return 200;
}

export async function resetPassword(
    userId: number, 
    newPassword: string
): Promise<number>
{
    const userRep = getRepository(UserEntity)
    let builder = userRep
        .createQueryBuilder("user")
        .addSelect("user.pword")
        .where("user.id = :id",{id: userId});
    let user,err;
    [user,err] = await resolve(builder.getOne());

    if(err !== null)
        return 500;

    if(user === undefined )
        return 404;

    if(!Password.checkPassword(newPassword))
        return 400;
    
    let password = await Password.hashPassword(newPassword);
    user.pword = password;

    [user,err] = await resolve(user.save());
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
    if(userId === undefined || isNaN(userId))
        return undefined;

    let user,err;
    [user,err] = await resolve(UserEntity.findOne({id: userId}));
    
    if(user === undefined || err !== null)
        return undefined;
    
    user.status = status;
    
    [user,err] = await resolve(user.save());
    
    if(user === undefined || err !== null)
        return false;
    return true;
}

/**
 * Gibt die Berechtigung eines Benutzers zurück
 * @param userId BenutzerID
 * @returns auth | undefined
 */
export async function getUserPermission(userId: number)
{
    if(userId === undefined || isNaN(userId))
        return undefined;

    const userRep = getRepository(UserEntity)
    let user,err;
    let builder = userRep
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.groups", "group")
        .where("user.id = :id",{id: userId});
    [user,err] = await resolve(builder.getOne());
    if(user === undefined || err !== null)
        return undefined;

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