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
  - 400 (Not-Found)
