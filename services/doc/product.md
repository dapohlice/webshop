# Product-Service

## Kategorie
 - Arbeiten mit Kategoriedatensätze
### POST /category
  - Anlegen eines Kategoriedatensatzes
#### Eingabe
```json
{
  "categoryname": "Testkategorie",
  "picturepath" : "/home/test/sub"
}
```
#### Rückgabe
  - 201 (Created) mit Ergebniss im JSON
``` json
{
    "_id": "5e428966ff9e4905f82e2eaf",
    "categoryname": "Testkategorie",
    "picturepath": "/home/test/sub",
    "__v": 0
}
```
  - 400 (Bad-Request)

### PUT category/:id
  - Bearbeiten eines Kategoriedatensatzes
#### Eingabe
  - Gesamte Kategorie ändern
```json
{
  "categoryname": "Test",
	"picturepath": "c:\test"
}
```
  - Oder -> nur Name ändern
```json
{
  "categoryname": "Test"
}
```
  - Oder -> nur Bildpfad ändern
```json
{
	"picturepath": "c:\test"
}
```
#### Rückgabe
  - 200 (OK)
  - 400 (Bad-Request)

### DELETE category/:id
  - Löschen eines Kategoriedatensatzes
#### Eingabe
  - Keine Eingabe
#### Rückgabe
  - 200 (OK)
  - 404 (Not Found)

### GET category/
  - Query aller Kategoriedatensätze
#### Eingabe
  - Keine Eingabe
#### Rückgabe
  - 200 (OK) mit Ergeniss im JSON-Format
```JSON
[
    {
        "_id": "5e391c581b223e002b41ee3c",
        "categoryname": "Testkategorie",
        "picturepath": "c/test/test1",
        "__v": 0
    },
    {
        "_id": "5e428966ff9e4905f82e2eaf",
        "categoryname": "Testkategorie",
        "picturepath": "/home/test/sub",
        "__v": 0
    }
]
```
  - 404 (Not-Found)

### GET categroy/:id
  - Query eines Kategoriedatensatzes über seine ID

#### Eingabe
  - Keine Eingabe

#### Ausgabe
  - 200 (OK) mit Ergeniss im JSON-Format
```json
{
    "_id": "5e428966ff9e4905f82e2eaf",
    "categoryname": "Testkategorie",
    "picturepath": "/home/test/sub",
    "__v": 0
}
```
  - 404 (Not-Found)

## Produkte
  - Arbeiten mit Artikeldatensätze inkl. Eigenschaftsdatensätze zu einem Artikel

### POST article/
  - Anlegen eines Artikels, dies kann mit oder ohne "Propertys" geschehen
  - Ein Artikel besitzt noch einen Timestamp, dieser KANN hier gesetzt werden
  - Die Eingabe eines Arrays aus Eigenschaftsdatensätzen MUSS hier nicht geschehen
#### Eingabe
```json
{
  "productid": 100,
  "name": "Testartikel",
  "description": "Artikel zum Testen",
  "price": "12.4",
  "state": true,
  "propertys": [{
                "subid": 1,
                "property": "blau, xxl",
                "amount": 12 }],
  "category": "Testkategorie"
}
```
#### Rückgabe
  - 201 (Created)
```json
{
    "_id": "5e43ad10172cda002bc86654",
    "productid": 100,
    "name": "Testartikel",
    "description": "Artikel zum Testen",
    "price": 12.4,
    "state": true,
    "propertys": [
        {
            "amount": 10,
            "_id": "5e43ad10172cda002bc86655",
            "subid": 1,
            "property": "blau, xxl"
        }
    ],
    "createdAt": "2020-02-12T07:45:20.249Z",
    "updatedAt": "2020-02-12T07:45:20.249Z",
    "__v": 0
}
```
  - 400 (Bad-Request)

### PUT article/:id
  - Bearbeiten eines Artikeldatensatzes über seine ProduktID
  - Die Felder die verändert werden sollen können einfach im JSON-Format übergeben werden
  - Die Propertys können hier nicht verändert werden
  - Der Status kann hier auch geändert werden
  - Die Felder id, v, createAt und updatedAt sind Felder aus der Datenbank und können nicht gändert werden.

#### Eingabe
  - Nur ein Beispiel
```json
{
    "name": "Änderung",
    "description": "Artikel zum Ändern",
    "price": 1000
}
```
#### Rückgabe
  - 200 (OK)
  - 404 (Not Found)

### PATCH article/:id
  - Ändern des Status eines Artikeldatensatzes

#### Eingabe
```json
{
  "state": false/true
}
```
#### Rückgabe
  - 200 (OK)
  - 404 (Not Found)

### GET /article
  - Alle Artikeldatensätze

#### Eingabe
  - Keine Eingabe

#### Rückgabe
  - 200 (OK)
```json
[
    {
        "_id": "5e43ad10172cda002bc86654",
        "productid": 100,
        "name": "Testartikel",
        "description": "Artikel zum Testen",
        "price": 12.4,
        "state": true,
        "propertys": [
            {
                "amount": 10,
                "_id": "5e43ad10172cda002bc86655",
                "subid": 1,
                "property": "blau, xl"
            }
        ],
        "createdAt": "2020-02-12T07:45:20.249Z",
        "updatedAt": "2020-02-12T07:45:20.249Z",
        "__v": 0
    },
    {
        "_id": "5e43b2c76240e8009b4cdff0",
        "productid": 101,
        "name": "Testartikel2",
        "description": "2. Artikel zum Testen",
        "price": 50,
        "state": true,
        "propertys": [
            {
                "amount": 10,
                "_id": "5e43b2c76240e8009b4cdff1",
                "subid": 1,
                "property": "rot, xl"
            }
        ],
        "createdAt": "2020-02-12T08:09:43.035Z",
        "updatedAt": "2020-02-12T08:09:43.035Z",
        "__v": 0
    }
]
```
  - 404 (Not Found)

### GET 7article/:id
  - Eigenschaftsdatensatz durch seine ID zurückgeben

#### Eingabe
  - Keine Eingabe

#### Rückgabe
  - 200 (OK)
```json
{
    "_id": "5e43ad10172cda002bc86654",
    "productid": 100,
    "name": "Testartikel",
    "description": "Artikel zum Testen",
    "price": 12.4,
    "state": true,
    "propertys": [
        {
            "amount": 10,
            "_id": "5e43ad10172cda002bc86655",
            "subid": 1,
            "property": "blau, xl"
        }
    ],
    "createdAt": "2020-02-12T07:45:20.249Z",
    "updatedAt": "2020-02-12T07:45:20.249Z",
    "__v": 0
}
```
  - 404 (Not Found)
