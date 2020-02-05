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
 * @returns Liste der Gruppen
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
 * @returns Gruppe
 */
export async function getOneGroup(groupId: number)
{
    if(isNaN(groupId) || groupId === undefined)
        return undefined;
    const groupRep = getRepository(GroupEntity)
    let builder = groupRep.createQueryBuilder("group")
        .leftJoinAndSelect("group.users", "user")
        .where("group.id = :id",{id: groupId});

    let group,err;
    [group,err] = await resolve(builder.getOne());
    if(group === undefined || err !== null)
        return undefined;    
    return group;
}


export async function createGroup(
    name: string
)
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

export async function deleteGroup(groupId: number)
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

export async function addUser(groupId: number, userId: number)
{
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

export async function removeUser(groupId: number, userId: number)
{
    let group,err;
    let builder = getRepository(GroupEntity)
        .createQueryBuilder("group")
        .leftJoinAndSelect("group.users", "user")
        .where("group.id = :id",{id: groupId});
    
    [group,err] = await resolve(builder.getOne())
    if(group === undefined || err !== null)
        return false;
    
    group.users = group.users.filter(user =>{
        user.id !== userId
    });

    [group,err] = await resolve(group.save());
    if(group === undefined || err != null)
        return false;
    return true;            
}

export async function changeGroup(groupId: number,permission: IPermission)
{
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