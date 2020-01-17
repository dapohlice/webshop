# README 

## Benötigt

- docker
- docker-compose
- nodejs

## Node Packages installieren
- in Server-Ordner wechseln
`cd ./server`
- node-Module installieren
`npm install`

## Docker-Umgebung starten
`docker-compose up`
### Umgebung wieder beeden
Strg+C


## Zu Beachten
- `docker-compose down` löscht die Docker-Container, also auch die Datenbank. Damit werden alle Daten gelöscht und beim nächsten starten ist eine frische Datenbank vorhanden.
- Beim ersten Start kann es vorkommen, dass die Datenbank noch nicht fertig ist, wenn der server startet. Bei einem Fehler in server, einfach nochmal neu starten. 

## Datenbank
- Port: 3306 (MariaDBs)
- Root-User:
  - Name: root
  - Password: passw0rd
- Test-User:
  - Name: test
  - Password: test
  - Datenbank: test

## Server
- läuft auf Port: localhost:3001/user