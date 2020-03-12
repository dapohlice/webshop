import resolve from "../resolver";

import axios from 'axios'; 

const PRODUCT_SERVICE = "http://product:3002"
const TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2VydmljZSIsImF1dGgiOnsiYXV0aF91c2VyIjp0cnVlLCJhdXRoX3Byb2R1Y3QiOnRydWUsImF1dGhfZ3JvdXAiOnRydWUsImF1dGhfbm9ybWFsT3JkZXJzIjp0cnVlLCJhdXRoX2FsbE9yZGVycyI6dHJ1ZX0sImlhdCI6MTU4NDAzNzM2MX0.CL925750lhPyHUY_fKEO3PoRWhzLgyyCkupnfQw-5tuVnuM1IN11SWHsodVjJ3YTe2SChTlu30_qD--rK9SKin9zT4NpwHn6nFU_iYUW-or0dtveOOHJQDPlp-1CYHr_1HUaMMwSQxTzORLh_EhDqUcEpx3mlh9K05MBS2wpnwM"

export async function getProduct(id: number):Promise<[number,any]>
{
    try{
        let res = await axios.get(PRODUCT_SERVICE+"/article/"+id,{
            headers: {
                'authorization': "Bearer "+TOKEN
            }
        });
        return [200,res.data];
    }catch(err)
    {
        switch(err.response.status){
            case 400:
            case 404:
                return [404,null];
                break;
            case 401:
            case 403:
                return [401,null];
                break;
            default: 
                console.error("Failed loading Product",err);
                return [500,null];
        }
        
    }
}

export async function reserveSubProdukt(productId, subproductId, amount)
{
    try{
        let res = await axios.patch(
            PRODUCT_SERVICE+"/article/"+productId+"/"+subproductId,
            {
                amount: amount
            },
            {
                headers: {
                    'authorization': "Bearer "+TOKEN
                }
            }
        );
        if(res.data !== undefined)
        {           
            for(var i = 0; i< res.data.propertys.length; i++){
                
                if(res.data.propertys[i].subid === subproductId)
                {
                    res.data.propertys[i].amount = amount;
                    return [200,res.data.propertys[i]];
                }
            }
        }else{
            return [404,undefined];
        }
        
    }catch(err)
    {
        console.log(err);
        switch(err.response.status){
            case 400:
            case 404:
                return [404,null];
                break;
            case 401:
            case 403:
                return [401,null];
                break;
            default: 
                console.error("Failed loading Product",err);
                return [500,null];
        }
        
    }
}