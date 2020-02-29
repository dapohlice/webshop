# Picture-Service

## POST /
- Lädt ein neues Bild hoch

### Eingabe
- 1 Bild als Formdata, mit dem Name **photo**
- mögliche Formate: gif, jpeg (jpg,jpeg), png
- Beispiel Javascript: (siehe Picture-Service /img/index.html)
```javascript
    var src = e.target.files[0];
    var form_data = new FormData();
    form_data.append("photo", src);

    var request = new XMLHttpRequest();
    request.open("POST","<picture-service>");
    request.send(form_data);
```
### Rückgabe
```
filename
```

## GET /:filename
- Gibt ein Bild vom Service zurück


## DELETE /:filename
- Löscht ein Bild vom Service
