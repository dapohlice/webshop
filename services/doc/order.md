# Order-Service

## GET /status
gibt alle Statuse zurück

### Rückgabe
```json
[
    {
        "id": 0,
        "name": "Created",
    },
]
```

## GET /order
gibt alle Bestellungen mit Status zurück

### Rückgabe
```json
    [
        {
            "id": "number",
            "mail": "string",
            "timestamp": "Datetime(2020-01-28T22:38:05.000Z)",
            "status":0 
        },
    ]
```

## GET /order/:id
- **id**: Order-Id

gibt eine Bestellung zurück

```json 
{
    "id": "1",
    "mail": "hans.meiser@gmx.de",
    "status": 1,
    "address": {
        "id": "2",
        "firstname": "Hans",
        "lastname": "Meier",
        "street": "Robert-Blum-StraÃŸe",
        "streetnumber": "45a",
        "plz": "01556",
        "town": "Stadt",
        "state": null,
        "country": "Deutschland"
    },
    "logs": [
        {
            "user": "dummy",
            "info": null,
            "status": 1,
            "timestamp": "2020-01-29T10:30:00.000Z"
        }
    ],
    "article": [
        {
            "amount": 1,
            "property": "M",
            "name": "T-Shirt",
            "price": 1200,
            "total": 1200,
            "subarticle_id": "1",
            "article_id": "0",
            "mapping_id": "1"
        }
    ]
}

```

## PATCH /order/:id
- **id**: Order-Id
ändert den Status einer Bestellung

### Eingabe
Body:
```json
    {
        "info": "string",   //Zusatzinformation(kann null/leer/nicht vorhanden sein)
        "status": 0         //kann gesetzt werden, ansonsten wird der nächste Status ausgewählt
                            //Status auf den die Bestellung gesetzt werden soll
    }
```
wenn der **status** nicht angegeben ist, dann wird der nächste ausgewählt

### Rückgabe
400: kein Status konnte gesetzt werden
  - z.B. kein Status ist gegeben und kein Nachfolger konnte ermittelt werden
200: status wurde geändert



## GET /order/status/:id
- **id**: Status-Id
Gibt alle Bestellungen eines Status zurück

### Rückgabe
```json
    [
        {
            "id": "number",
            "mail": "string",
            "timestamp": "Datetime(2020-01-28T22:38:05.000Z)",
        },
    ]
```

## POST /order
- Erstellt eine neue Bestellung

### Eingabe:
```json
{
	"mail":"email@mail.de",
	"address":{
		"firstname": "Hans",
        "lastname": "Meier",
        "street": "Robert-Blum-Straße",
        "streetnumber": "45a",
        "plz": "01556",
        "town": "Stadt",
        "state": null,
        "country": "Deutschland"
	},
	"articles": [
			{
				"articleId": 1,
				"subarticleId": 1,
				"amount": 2
			}
		]
}
```

### Rückgabe:
```json
{
    "mail": "email@mail.de",
    "address": {
        "firstname": "Hans",
        "lastname": "Meier",
        "street": "Robert-Blum-Straße",
        "streetnumber": "45a",
        "plz": "01556",
        "town": "Stadt",
        "state": null,
        "country": "Deutschland",
        "id": 23
    },
    "articles": [
        {
            "amount": 2,
            "property": "M",
            "name": "T-Shirt",
            "price": 1200,
            "total": 2400
        }
    ],
    "user_key": "ijxh7rlaktsblxth7w8nzh"
}
```
- **user_key**: ein zufällig generierter Key um die Bestellung einem Benutzer zuzuordnen

Status:
  - 400: Bestelldaten sind nicht vollständig


## POST /order/submit
- Bestätigt eine Bestellung und setzt deneren Status auf 1 bzw. Ordered
### Eingabe
```json
{
	"user_key": "ijxh7rlaktsblxth7w8nzh"
}
```
- **user_key**: kommt aus der Bestellungen (POST /order)
### Rückgabe
Status:
  - 200: wurde ausgeführt
  - 400: user_key wurde nicht gefunden oder ist abgelaufen

