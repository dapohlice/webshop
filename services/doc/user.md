# User-Service

## Login
- Anmelden des Benutzers
### POST /login
#### Eingabe
```json
{
	"loginname":"a.dmin",
	"password":"passw0rd"
}
```
#### Rückgabe
```json
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYS5kbWluIiwiYXV0aCI6eyJhdXRoX3VzZXIiOnRydWUsImF1dGhfcHJvZHVjdCI6dHJ1ZSwiYXV0aF9ncm91cCI6dHJ1ZSwiYXV0aF9ub3JtYWxPcmRlcnMiOnRydWUsImF1dGhfYWxsT3JkZXJzIjp0cnVlfSwiaWF0IjoxNTgwOTk5NjUyLCJleHAiOjE1ODEwMDMyNTJ9.Kq1HXoMBj6O95cDlxZQpTgrXCphAjXPuNGJvTza_9-hVpHhJgpRW8s6aJRgaf8dW_OqdS_TjnvMS-yHVr6B2IkNnFRUblP2s6FzyrdbKI7U6-TYKW3Uc7MAs__nk-6-j9jODw9DglwkR0juyBf8i-k4XRKpEao6-XnoAtZdXVJ8
```

## MyUser
- Verwaltung des eigenen Benutzers
- JWT benötigt

### GET /me
- Gibt die Daten des eigenen Benutzers zurück

### Rückgabe
```json
{
    "id": "1",
    "firstname": "admin",
    "lastname": "dmin",
    "mail": "admin@localhost",
    "loginname": "a.dmin",
    "status": true,
    "groups": [
        {
            "id": "1",
            "groupname": "Admin",
            "auth_user": true,
            "auth_product": true,
            "auth_group": true,
            "auth_normalOrders": true,
            "auth_allOrders": true
        }
    ]
}
```

### PATCH /me/password
- Ändert das eigene Passwort

#### Eingabe
```json
{
	"oldPassword":"passw0rd",
	"newPassword":"Passw0rd"
}
```


## User
- Allgemeine Benutzer-Verwaltung
- Benutzer benötigt die Berechtigung für Benutzer
  - JWT benötigt
  - auth_user = true in JWT

### GET /user
- Gibt alle Benutzer zurück

#### Rückagbe
```json
[
    {
        "id": "1",
        "firstname": "admin",
        "lastname": "dmin",
        "status": true
    },
]
```

### POST /user
- Erstellt einen neuen Benutzer
- es wird ein Loginname aus Vor- und Nachname erstellt, dieser kann später nicht mehr geändert werden
- ein zufälliges Passwort wird generiert, dies sollte aber geändert werden
- Vor- und Nachname müssen mindestens 3 Zeichen lang sein
#### Eingabe
```json
{
	"firstname":"test",
	"lastname":"test",
	"mail":"mail@mail.de"
}
```
#### Rückagbe
```json
{
    "id": "7",
    "firstname": "test",
    "lastname": "test",
    "mail": "mail@mail.de",
    "loginname": "te.test",
    "status": true,
    "pword": "zthjpwkdt35v"
}
```
### GET /user/:id
- **id**: Benutzer-Id
- gibt einen Benutzer mit allen Gruppen in der er zugehörig ist
#### Rückgabe
```json
{
    "id": "1",
    "firstname": "admin",
    "lastname": "dmin",
    "mail": "admin@localhost",
    "loginname": "a.dmin",
    "status": true,
    "groups": [
        {
            "id": "1",
            "groupname": "Admin",
            "auth_user": true,
            "auth_product": true,
            "auth_group": true,
            "auth_normalOrders": true,
            "auth_allOrders": true
        }
    ]
}
```
### PUT /user/:id
- **id** Benutzer-Id
- Ändert die Stammdaten eines Benutzers
#### Eingabe
```json
{
	"firstname":"changed Name",
	"lastname":"changed Name",
	"mail": "changed@name.de"
}
```
#### Rückgabe
```json
{
    "id": "7",
    "firstname": "changed Name",
    "lastname": "changed Name",
    "mail": "changed@name.de",
    "loginname": "te.test",
    "status": true
}
```
### PATCH /user/:id
- **id** BenutzerId
- Ändert den Status eines Benutzers
#### Eingabe
```json
{
    "status":false
}
```

### PATCH /user/:id/resetpassword
- Ändert das Passwort eines Benutzers
- Passwort muss mind. eine Zahl, einen Großbuchstaben und einen kleinbuchstaben besitzten
#### Eingabe
```json
{
    "password":"neues passwort"
}
```

### GET /user/:id/permission
- **id** Benutzer-Id
- Gibt die vollständige Berechtigung des Benutzers, welche er durch alle Gruppen erhält

#### Rückgabe
```json
{
    "auth_user": true,
    "auth_product": true,
    "auth_group": true,
    "auth_normalOrders": true,
    "auth_allOrders": true
}
```

## Group

- Allgemeine Gruppen-Verwaltung
- Benutzer benötigt die Berechtigung für Gruppen
  - JWT benötigt
  - auth_group = true in JWT

### GET /group
- gibt alle Gruppen zurück

#### Rückgabe
```json
[
    {
        "id": "1",
        "groupname": "Admin"
    },
]
```

### POST /group
- erstellt eine neue Gruppe

#### Eingabe
```json
{
    "groupname":"test"
}
```

#### Rückgabe
```json
{
    "groupname": "test",
    "id": 3
}
```

### GET /group/:id
- **id** Gruppen-Id
- gibt eine Gruppe detailiert zurück

#### Rückgabe
```json
{
    "id": "1",
    "groupname": "Admin",
    "auth_user": true,
    "auth_product": true,
    "auth_group": true,
    "auth_normalOrders": true,
    "auth_allOrders": true,
    "users": [
        {
            "id": "1",
            "firstname": "admin",
            "lastname": "dmin"
        },
    ]
}
```

### PUT /group/:id
- **id** Gruppen-Id
- Ändert die Berechtigung der Gruppe

#### Eingabe
```json
{
	"auth_user": true,
    "auth_product": true,
    "auth_group": false,
    "auth_normalOrders": true,
    "auth_allOrders": true	
}
```

### DELETE /group/:id
- **id** Gruppen-Id
- Löscht eine Gruppe

### PATCH /group/:id/add
- **id** Gruppen-Id
- Fügt der Gruppe einen Benutzer hinzu
#### Eingabe
```json
{
    "userId": 3
}
```

### PATCH /group/:id/remove
- **id** Gruppen-Id
- Entfernt einen Benutzer von einer Gruppe
#### Eingabe
```json
{
    "userId": 3
}
```