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

app.post('/upload', async (req, res) => {
    console.log("asasdfasd")
    // console.log(req.body.img)
    var img = req.body.img ? Buffer.from(req.body.img, 'base64') : 'dou'
    var [obj, prc] = await getObjfromPic(img)
    var user = req.body.username ? req.body.username : "Guest"
    var newId = random10Dig();
    while(Object.keys(actualDb).includes(newId)){
        newId = random10Dig();
    }
    ref.child(`${newId}`).set({
        object: obj,
        porcentaje: prc,
        yes: 0,
        no: 0,
        user,
        url: req.body.url
    })
    var ans = `Se encontró un/a ${obj} en la imagen, con un ${prc}% de confianza`
    console.log("ANS",ans)
    res.json({
        object: obj,
        porcentaje: prc,
        id: newId
    })
})

app.post('/confirm', async (req,res)=>{
    ref.child(`${req.body.id}`).set({
        userSaid: req.body.ans
    }, (err)=>{
        if(err) return res.json(err)
        else return res.status(400).json('Todo bien')
    })
    
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})