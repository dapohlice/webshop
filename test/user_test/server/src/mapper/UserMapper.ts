import {getConnection} from "typeorm";
import {User} from "../entity/User";


export async function CreateUser(
    firstname: string,
    lastname: string,
    age: number
){
    try{
        const user = new User();
        user.firstName = firstname
        user.lastName = lastname
        user.age = age

        return await user.save();
    }catch(ex)
    {
        console.log("catchaed expeasd");
        console.log(ex);
        return false;
    }
}

export function DeleteUser(id: number){
}

export async function ChangeUser(
    id: number,
    firstname: string,
    lastname: string,
    age: number
){
    let user = await GetUser(id);
    user.firstName = firstname;
    user.lastName = lastname;
    user.age = age;
    return await user.save();
}

export async function GetUser(id: number){
    return await User.findOne({id: id});
}

export async function GetAllUsers(){
    let users = await User.find();
    console.log(users);
    return users;
}