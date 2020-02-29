# Todo's

## Shop-Service
- GET Articles: Anzeige von allen articles mit Bildern auf Landingpage
- POST Ordered Order: Bestellvorgang erfassen und alle Daten abschicken als status ordered setzen

## User-Service
- PATCH: Anfragen waren nicht möglich, erlaubte Methoden wurden provisorisch hinzugefügt, bitte mal kontrollieren, ob es so korrekt ist wie ursprünglich vorgesehen
- ~~DELETE: Anfrage für User von Gruppe löschen, löscht momentan alle User von der Gruppe~~
- ~~PATCH /user/:id/resetpassword - Reset password führt zu error 400~~ (Richtlinie beachten (mind.8, Zahl,Groß-,Kleinbuchstabe))
- Suche: Anfragen die für eine Suche gestellt werden können

## Product-Service
- **WICHTIG:** GET article: category bitte auch mit name zurückgeben, sonst debuggen fast unmöglich
- **WICHTIG:** POST article: picturepath im json ergänzen
- **WICHTIG:** PUT article/:id: Nach Editieren und schicken von leeren Feldern, kommt Status 200 zurück, besser Status: 400 schicken, sonst ist DB gefährdet! **UND** das endet im Admin-Service in endlosen *if else* Verzweigungen.
- PATCH State/:id ()Ändern des Status) Request läuft immer in Response Status: 404 **ABER** mit PUT funktioniert
- Article: bzgl. Preis: Einigung auf cents! Kein "Punkt" oder "Komma" im input zulassen.
- Propertys: Einigung auf eventuell bestimmte Formate
- Suche: Anfragen die für eine Suche gestellt werden können
- Bilder bei Producten

## Picture-Service
- Funktionsweise noch unklar, wie können Bilder im service gespeichert werden?
    - Ajax auf http://localhost:3004/ mit post method und mit jpeg als data schicken?
    - Können wir die Vorgehensweise im nächsten Meeting mal durchgehen?

## Shop
- Produkt Details
-