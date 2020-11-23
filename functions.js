const AWS = require('aws-sdk');
const fs = require('fs')
AWS.config.update({ region: 'us-east-1' });
var credentials = new AWS.Credentials('AKIA2PEYOMGO47K4DY5R', 'DHmccpx1QCgOOii0RM+ef2vE90HmV8opvurBiwWk')
AWS.config.update({ credentials })
// const {Translate} = require('@google-cloud/translate').v2;
const projectId = 'bua-aws'
// const translate = new Translate({projectId});
const rekognition = new AWS.Rekognition();

const random10Dig = () => String(Math.floor(Math.random() * 1000000000))

async function getObjfromPic(bytes) {

    return new Promise((resolve, reject) => {
        var byte = bytes == 'dou' ? fs.readFileSync('teivo.jpg') : bytes
        var params = {
            Image: {
                Bytes: byte
            },
            MaxLabels: 1
        }
        rekognition.detectLabels(params, function (err, response) {
            if (err) {
                console.log(err, err.stack);
            } else {
                response.Labels.forEach(async label => {
                    // const [translation] = await translate.translate(label.Name, 'es');
                    resolve([label.Name, String(label.Confidence).substring(0,4)])
                })
            }
        });
    })
}

module.exports = {
    getObjfromPic,
    random10Dig
}