import {getRepository} from "typeorm";
import {GroupEntity} from '../entity/GroupEntity' 
import * as Password from "./Password";
import resolve from '../resolver';
import { UserEntity } from "../entity/UserEntity";

/**
 * gibt alle Gruppen zurück
 * @returns Liste der Gruppen
 */
export async function getAllGroups()
{
    const groupRep = getRepository(GroupEntity)
    let groups = await groupRep
        .createQueryBuilder("group")
        .select([
            "group.id",
            "group.name"
        ])
        .getMany();
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
    let group = await groupRep
        .createQueryBuilder("group")
        .leftJoinAndSelect("group.users", "user")
        .where("group.id = :id",{id: groupId})
        .getOne();
    return group;
}


export async function createGroup(
    name: string
)
{ 
    if(name === undefined)
        return undefined;

    let group = new GroupEntity();
    group.name = name;
    
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

    let group = await GroupEntity.findOne({id: groupId})
    if(group === undefined)
        return false;
    
    if(undefined === await group.remove())
        return false;
    return true;
    
}

export async function addUser(groupId: number, userId: number)
{

    let user = await UserEntity.findOne({id: userId});
    if(user === undefined)
        return false;
    let group = await getRepository(GroupEntity)
        .createQueryBuilder("group")
        .leftJoinAndSelect("group.users", "user")
        .where("group.id = :id",{id: groupId})
        .getOne();
    if(group === undefined)
        return false;
    
    group.users.push(user);
    if(undefined === await group.save())
        return false;
    return true;            
}

export async function removeUser(groupId: number, userId: number)
{
    let group = await getRepository(GroupEntity)
        .createQueryBuilder("group")
        .leftJoinAndSelect("group.users", "user")
        .where("group.id = :id",{id: groupId})
        .getOne();
    if(group === undefined)
        return false;
    
    group.users = group.users.filter(user =>{
        user.id !== userId
    });
    if(undefined === await group.save())
        return false;
    return true;            
}