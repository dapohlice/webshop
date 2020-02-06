# JWT Verify

- Dient zur Verifikation eines JWT-Token und der damit zusammenhängenden indentifikation eines Benutzers

## processJwt
Aufruf für die Verarbeitung des JWT-Tokens
```js
const JWT = require('./jwt/verify.js');

let auth = req.get('Authorization')
let status,jwt;
[status,jwt] = JWT.processJwt(auth);

```
### Eingabe
- auth: muss aus dem Header abgefragt werden
- Header-Key: Authorization
- Value: Bearer TOKEN
  - "Bearer" + Leerzeichen + Token


### gibt zurück
[StatusCode,JWT-Data]
  - [200,JWT]: JWT-Token Verifiziert 
  - [401,null]: Daten sind falsch
  - [401,"Expired"]: JWT-Token ist abgelaufen
  - [500,null]: Fehler

### JWT:
```js
{
  name: 'a.dmin',       // Loginname des Benutzers
  auth:                 // Berechtigung des Benutzers
  {         
    auth_user: true,
    auth_product: true,
    auth_group: true,
    auth_normalOrders: true,
    auth_allOrders: true
  },
  iat: 1581003946,      // Ausstellungszeitpunkt
  exp: 1581007546       // Ablaufzeitpunkt
}

```

## Public Key:
- Der Public-Key "key.pub" muss neben der verify.js Datei liegen
 

 