const express = require('express');
var CryptoJS = require("crypto-js");
var Base64 = require("crypto-js/enc-base64");
var Utf8 = require("crypto-js/enc-utf8");
var qs = require('querystring');

const path = require('path');
const { utimes } = require('fs');

const app = express();
const port = process.env.PORT || 8080;

var key = Utf8.parse('mommiespwdnyadisuruhtigapuluhdua');
var iv = Utf8.parse('1092837465839201');

var cipherParams = {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7
}

function encrypt(plaintext) {
    const resultArrayConverted = arrayOfUint8Converted(plaintext)

    var result = CryptoJS.AES.encrypt(
        arrayToStringConvert(resultArrayConverted),
        key,
        cipherParams
    )
    return Utf8.stringify(Utf8.parse(result))
}

function decrypt(ciphertext) {
    const resultArrayConverted = arrayOfUint8Converted(ciphertext)

    return CryptoJS.AES.decrypt(
        arrayToStringConvert(resultArrayConverted),
        key,
        cipherParams
    ).toString(Utf8)
}

function arrayOfUint8Converted(text) {
    const bufferStringUTF8 = Buffer.from(text, 'utf-8');
    return new Uint8Array(
        bufferStringUTF8.buffer,
        bufferStringUTF8.byteOffset,
        bufferStringUTF8.length / Uint8Array.BYTES_PER_ELEMENT);
}

function arrayToStringConvert(array) {
    return new TextDecoder("utf-8").decode(array)
}

const addQuery = (req, res, next) => {
    req.query.param = req.query.param;
    next();
}

app.get('/webview', addQuery, express.query(),  function (req, res) {
   
    // var encryptString = qs.escape(encrypt(req.query.param))
    var resultDecrypt = decrypt(qs.unescape(req.query.param))
    const decryptSplit = resultDecrypt.split('||')

    res.send("Decrypt: <code>" + resultDecrypt +
        "</code></br> Username: <code>" + decryptSplit[0] +
        "</code></br> Token: <code>" + decryptSplit[1] +
        "</code></br> Slug: <code>" + decryptSplit[2]+'</code>')
})


app.get('/decrypt/:enkripsi', function (req, res) {
    var getEnkripsi = req.params.enkripsi
    var plaintext = "abc"
    var encryptString = qs.escape(encrypt(plaintext))
    var resultDecrypt = decrypt(qs.unescape(encryptString)).split('||')

    res.send('ciphertext: ' + encryptString +
        "\n decrypt: " + resultDecrypt +
        "\n username: " + resultDecrypt[0] +
        "\n token: " + resultDecrypt[1] +
        "\n slug: " + resultDecrypt[2])
})



// sendFile will go here
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);