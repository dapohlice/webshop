const express = require('express');
const path = require('path');
const multer = require('multer')
const fs = require('fs')
const JWT = require('./jwt/verify.js')

const app = express();

const port = process.env.PORT;
const stage = process.env.NODE_ENV;

function checkPermission(req)
{
    let auth = req.get('Authorization');
    let status, jwt;
    [status,jwt] = JWT.processJwt(auth);
    if(status !== 200)
    {
        return status;
    }
    if(jwt.auth_product === false)
    {
        return 403;
    }
}

/* 
 * loging functions
 */
// jeden Request
function logRequest(req,res,next)
{
    console.log(`Request ${req.method} ${req.originalUrl} from ${req.ip}`)
    next()
}
app.use(logRequest);

// jeden Fehler
function logError(err,req,res,next)
{
    console.error(`Request ${req.method} ${req.originalUrl} from ${req.ip} FAILED`)
    console.error(err);
}
app.use(logError);

/**
 * Hauptapp
 */

// Bilder Ordner
const dir = path.join(__dirname,'img')

 // Nur Bilder zulassen
function fileFilter(req,file,cb)
{
    switch(file.mimetype)
    {
        case "image/gif":
        case "image/jpeg":
        case "image/png":
            cb(null,true);
            break;
        default: 
            cb(new multer.MulterError())
    }
}

// Dateinamen festlegen
const storage = multer.diskStorage({
    destination: function(req,file,cb)
    {
        cb(null,dir);
    },
    filename: function(req,file,cb)
    {
        var ending = "";
        switch(file.mimetype)
        {
            case "image/gif":
                ending = ".gif";
                break;
            case "image/jpeg":
                ending = ".jpeg";
                break;
            case "image/png":
                ending = ".png";
                break;
        }
        var filename;
        do{
            filename = Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15);
        }
        while(fs.existsSync(path.join(dir,filename+ending)));
        
        cb(null,filename+ending);
    }
})


// Einstellungen für Multer
const upload = multer(
    {
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 2097152
        }
    }
).single('photo');


// Dateien erstellen
app.post('/',
    function(req,res){    

        let result = checkPermission(req);
        if(result !== 200)
        {
            res.sendStatus(result);
            return;
        }

        upload(req,res, function(err)
        {
            if(err instanceof multer.MulterError)
            {
                console.error(err);
                res.status(400).send("File not allowd");
            }else if(err)
            {
                console.error(err);
                res.statusStatus(500);
            }
            res.send(req.file.filename);
            console.log("File uploaded: "+req.file.filename);
        });
    }
);

// Dateien löschen
app.delete('/:name',function(req,res){
    let result = checkPermission(req);
    if(result !== 200)
    {
        res.sendStatus(result);
        return;
    }
    try{
        let file = path.join(dir,req.params.name);
        if(!fs.existsSync(file))
        {
            res.sendStatus(404);
            return;
        }
        fs.unlinkSync(file);
        res.sendStatus(200);
    }catch(err)
    {
        console.error(err);
        res.sendStatus(500);
    }
});

// Images bereitstellen
app.use(express.static(dir))
/**
 * Starten
 */
app.listen(port, () => console.log(`Picture Service (${stage}) Listen On ${port}`))