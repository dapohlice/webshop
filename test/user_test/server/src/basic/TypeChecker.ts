import {Request,Response} from "express";

export function GetString(req: Request, property: string):any
{
    if(req == null)
        return false;
    if(property == null)
        return false;
    
    if(req.body == null)
        return false;
}