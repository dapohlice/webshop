# Order-Service

## GET /order
gibt alle Bestellungen mit Status zurück

### Rückgabe
```json
    [
        {
            "id": "number",
            "mail": "string",
            "timestamp": "Datetime(2020-01-28T22:38:05.000Z)",
            "status":{
                "id": 0,
                "name": "string"
            }
        },
    ]
```

## GET /order/:id
gibt eine Bestellung zurück

```json 
{
    "id": "4",
    "mail": "h.simpson@aol.com",
    "timestamp": "2020-01-28T22:38:05.000Z",
    "status": {
        "id": 4,
        "name": "Shiped"
    },
    "address": {
        "id": "4",
        "firstname": "Homer",
        "lastname": "Simpson",
        "street": "Evergreenterace",
        "streetnumber": "74",
        "plz": "00001",
        "town": "Springfield",
        "state": "State",
        "country": "United States"
    },
    "logs": [
        {
            "id": "1",
            "timestamp": "2020-01-28T22:45:54.000Z",
            "user": "dummy",
            "info": null,
            "status": {
                "id": 3,
                "name": "Packed"
            }
        }
    ],
    "articles": [
        {
            "id": "6",
            "amount": 7,
            "property": "",
            "article": {
                "id": "6",
                "article_id": "0",
                "name": "Calendar 2020",
                "timestamp": "2020-01-28T22:38:05.000Z",
                "price": 2200
            }
        }
    ]
}

```

## PATCH /order/:id
ändert den Status einer Bestellung

### Eingabe
Body:
```json
    {
        "info": "string",   //Zusatzinformation(kann null/leer/nicht vorhanden sein)
        "status": 0         //Status auf den die Bestellung gesetzt werden soll
    }
```
wenn der **status** nicht angegeben ist, dann wird der nächste ausgewählt

### Rückgabe
400: kein Status konnte gesetzt werden
  - z.B. kein Status ist gegeben und kein Nachfolger konnte ermittelt werden
200: status wurde geändert



## GET /order/status/:id
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