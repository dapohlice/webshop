import {getRepository} from "typeorm";
import {GroupEntity} from '../entity/GroupEntity' 
import * as Password from "./Password";
import resolve from '../resolver';
import { UserEntity } from "../entity/UserEntity";

export interface IPermission {
    auth_user: boolean,
    auth_product: boolean,
    auth_group: boolean,
    auth_normalOrders: boolean,
    auth_allOrders: boolean
}


/**
 * gibt alle Gruppen zurück
 * @returns Liste der Gruppen | undefinded
 */
export async function getAllGroups()
{
    const groupRep = getRepository(GroupEntity)
    let groups,err;
    [groups,err] = await resolve(groupRep
        .createQueryBuilder("group")
        .select([
            "group.id",
            "group.groupname"
        ])
        .getMany());
    if(err !== null)
        return undefined;
    return groups;
}

/**
 * Gibt eine Gruppe zurück
 * @param userId Gruppen-Id
 * @returns Gruppe | undefined
 */
export async function getOneGroup(groupId: number)
{
    if(groupId === undefined || isNaN(groupId))
        return undefined;
    const groupRep = getRepository(GroupEntity)
    let builder = groupRep.createQueryBuilder("group")
        .select("group.id")
        .addSelect("group.groupname")
        .addSelect("group.auth_user")
        .addSelect("group.auth_product")
        .addSelect("group.auth_group")
        .addSelect("group.auth_normalOrders")
        .addSelect("group.auth_allOrders")
        .addSelect("user.id")
        .addSelect("user.firstname")
        .addSelect("user.lastname")
        .leftJoin("group.users", "user")
        .where("group.id = :id",{id: groupId});

    let group,err;
    [group,err] = await resolve(builder.getOne());
    if(group === undefined || err !== null)
        return undefined;    
    return group;
}

/**
 * Erstellt eine neue Gruppe
 * @param name Gruppenname
 * @returns Gruppe | undefined
 */
export async function createGroup(name: string)
{ 
    if(name === undefined)
        return undefined;

    let group = new GroupEntity();
    group.groupname = name;
    
    let result,err;
    [result,err] = await resolve(group.save());
    if(err != null)
        return undefined;
    return result;
}

/**
 * Löscht eine Gruppe
 * @param groupId Gruppen-Id
 * @returns true | false
 */
export async function deleteGroup(groupId: number):Promise<boolean>
{
    if(isNaN(groupId))
        return false;

    let group,err;
    [group,err] = await resolve(GroupEntity.findOne({id: groupId}));
    if(group === undefined || err != null)
        return false;
        
    [group,err] = await resolve(group.remove())
    if(undefined === group || err !== null)
        return false;
    return true;
    
}

/**
 * Fügt einen Benutzer einer Gruppe hinzu
 * @param groupId Gruppen-Id
 * @param userId Benutzer-Id
 * @returns true | false
 */
export async function addUser(groupId: number, userId: number)
{
    if(
        groupId === undefined || 
        isNaN(groupId) ||
        userId === undefined ||
        isNaN(userId)
    )
        return false;

    let err,user,group;
    [user,err] = await resolve(UserEntity.findOne({id: userId}));
    if(user === undefined || err != null)
        return false;
    
    let builder = getRepository(GroupEntity)
        .createQueryBuilder("group")
        .leftJoinAndSelect("group.users", "user")
        .where("group.id = :id",{id: groupId});        
    
    [group,err] = await resolve(builder.getOne());
    if(group === undefined || err != null)
        return false;
    
    group.users.push(user);

    [group,err] = await resolve(group.save());
    if(undefined === group || err != null)
        return false;
    return true;            
}

/**
 * Entfernt einen Benutzer von einer Gruppe
 * @param groupId Gruppen-Id
 * @param userId Benutzer-Id
 * @returns true | false
 */
export async function removeUser(groupId: number, userId: number):Promise<boolean>
{
    if(
        groupId === undefined || 
        isNaN(groupId) ||
        userId === undefined ||
        isNaN(userId)
    )
        return false;

    let group,err;
    let builder = getRepository(GroupEntity)
        .createQueryBuilder("group")
        .leftJoinAndSelect("group.users", "user")
        .where("group.id = :id",{id: groupId});
    
    [group,err] = await resolve(builder.getOne())
    if(group === undefined || err !== null)
        return false;
        
    group.users = group.users.filter((user) =>
        {
           let res = user.id != userId;
           return res;
        }
    );

    [group,err] = await resolve(group.save());
    if(group === undefined || err != null)
        return false;
    return true;            
}

/**
 * Ändert die Berechtigungen einer Gruppe
 * @param groupId Gruppen-Id
 * @param permission Berechtigung
 * @returns true | false
 */
export async function changeGroup(groupId: number,permission: IPermission)
{
    if(
        groupId === undefined || 
        isNaN(groupId) ||
        permission === undefined
    )
        return false;
        
    let group,err;
    [group,err] = await resolve(GroupEntity.findOne({id: groupId}));
    if(err !== null || group === undefined)
        return false;
    group.auth_allOrders = permission.auth_allOrders;
    group.auth_group = permission.auth_group;
    group.auth_normalOrders = permission.auth_normalOrders;
    group.auth_product = permission.auth_product;
    group.auth_user = permission.auth_user;
    [group,err] = await resolve(group.save());
    if(err !== null || group === undefined)
        return false;
    return true;
}