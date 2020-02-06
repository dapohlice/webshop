# Allgemein

## HttpStatus-Codes
- 200 (OK): Alles hat geklappt
- 400 (Bad Request): Eingabe war falsch, z.B. Eingabe fehlen oder haben das falsche format
- 401 (Unauthorized): JWT-Token fehlt, ist Abgelaufen oder ist Fehlerhaft
- 403 (Forbidden): Der Benutzer hat nicht das Recht auf diese Resource zuzugreifen
- 404 (Not Found): Der Pfad ist nicht vorhanden oder die Resource ist nicht vorhanden
- 500 (Internal Server Error): Fehler im Code