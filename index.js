const express = require('express');
const admin = require('firebase-admin')
const { getObjfromPic, random10Dig } = require('./functions')
const app = express()
const uuid = require('uuid').v4
const port = 8000
const keys = require('./firebase.json')
var actualDb = {}
admin.initializeApp({
    credential: admin.credential.cert(keys),
    databaseURL: "https://bua-aws.firebaseio.com"
});
const ref = admin.database().ref('objectEntries/')

app.use(express.json());

ref.on('value', (a,b)=>{  
    actualDb = a.val()
})

app.get('/upload', async (req, res) => {
    var img = req.body.img ? Buffer.from(req.body.img, 'base64') : 'dou'
    var [obj, prc] = await getObjfromPic(img)
    var newId = random10Dig();
    while(Object.keys(actualDb).includes(newId)){
        newId = random10Dig();
    }
    ref.child(`${newId}`).set({
        object: obj,
        porcentaje: prc,
        yes: 0,
        no: 0,
        url: req.body.url
    })
    var ans = `Se encontró un/a ${obj} en la imagen, con un ${prc}% de confianza`
    res.json({
        object: obj,
        porcentaje: prc
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})