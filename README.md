# README 

Webshop 

- Softwareprojekt 5 Semester BA Leipzig

## Mitglieder

- Lukas Klausnitzer
- Adrian Neubert
- Sahar Momenzadeh
- Alexander Pohl

## Benötigte Umgebung
- docker
- docker-compose

### Container erstellen

- Alle
```bash
./build.sh
```
- Datenbank mit neuer Datenbank, **alte Datenbank wird gelöscht**
```bash
./update<Order/Product>DB.sh
```


### Container starten
- Alle 
  - außer Product Admin Seite
```bash
./start.sh
```
- Nur Order mit Datenbank
```bash
./startOrder.sh
```
- Nur Product mit Datenbank und Admin Seite
```bash
./startProduct.sh
```

## Anpassen

- Code wird in **services** angepasst
- node dependecies werden in den dateien **package.json** im jeweiligen Ordner in **dockerfiles** angepasst
- Hauptanwendung muss immer **index.js** sein








