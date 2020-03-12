var jwt = require('jsonwebtoken');
var path = require('path');
var fs = require('fs');
const dir = path.join(process.cwd(),'key');

let privateKey = fs.readFileSync(dir); 
let auth = {
    auth_user: true,
    auth_product: true,
    auth_group: true,
    auth_normalOrders: true,
    auth_allOrders: true
}
let data = {
    name: "service", 
    auth: auth
}
let options = {
    algorithm: 'RS256',
}


let token = jwt.sign(data,privateKey,options);

console.log(token);

fs.writeFile("token.txt", token,function (err){
    if(err !== null) console.error("Failed save token:",err)
})