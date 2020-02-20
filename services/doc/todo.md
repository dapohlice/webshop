# Todo's

## User-Service
- PATCH: Anfragen waren nicht möglich, erlaubte Methoden wurden provisorisch hinzugefügt, bitte mal kontrollieren, ob es so korrekt ist wie ursprünglich vorgesehen
- ~~DELETE: Anfrage für User von Gruppe löschen, löscht momentan alle User von der Gruppe~~
- ~~PATCH /user/:id/resetpassword - Reset password führt zu error 400~~ (Richtlinie beachten (Zahl,Groß-,Kleinbuchstabe))
- Suche: Anfragen die für eine Suche gestellt werden können
## Product-Service
- **WICHTIG:** PUT article/:id: Nach Editieren und schicken von leeren Feldern, kommt Status 200 zurück, besser Status: 400 schicken, sonst ist DB gefährdet! **UND** das endet im Admin-Service in endlosen *if else* Verzweigungen.
- Article: bzgl. Preis: Einigung auf ein bestimmtes Format (z.B.: cent)
- Propertys: Einigung auf eventuell bestimmte Formate
- Suche: Anfragen die für eine Suche gestellt werden können
## Picture-Service
- Funktionsweise noch unklar, wie können Bilder im service gespeichert werden?
    - Ajax auf http://localhost:3004/ mit post method und mit jpeg als data schicken?
    - Können wir die Vorgehensweise im nächsten Meeting mal durchgehen?
