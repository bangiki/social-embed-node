const express = require('express');
const CryptoJS = require("crypto-js");
const Utf8 = require("crypto-js/enc-utf8");
const qs = require('querystring');

const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

const handlebars = require('express-handlebars');
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
    partialsDir: __dirname + '/views/partials/'
}));

articleList = () => {
    return [
        {
            link: 'https://editorial.femaledaily.com/blog/2021/06/28/4-eye-cream-dengan-kandungan-retinol-untuk-bikin-tampilan-lebih-awet-muda',
            title: '4 Eye Cream dengan Kandungan Retinol untuk Bikin Tampilan Lebih Awet Muda'
        },
        {
            link: 'https://editorial.femaledaily.com/blog/2021/06/15/rangkaian-citra-cantik-indonesia-baru-untuk-kulit-lebih-cerah-dan-sehat',
            title: 'Rangkaian Citra Cantik Indonesia Baru untuk Kulit Lebih Cerah dan Sehat'
        },
    ];
}

tokenParseData = (param) => {
    var resultDecrypt = decrypt(qs.unescape(param))
    const decryptSplit = resultDecrypt.split('||')
    return [
        {
            username: decryptSplit[0],
            token: decryptSplit[1],
            articleSlug: decryptSplit[2]
        }
    ];
}
const addQuery = (req, res, next) => {
    req.query.slug = req.query.slug;
    next();
}
// Routing
app.get('/', addQuery, express.query(), (req, res) => {

    res.render('main', { 
        layout: 'index', 
        articles: articleList(), 
        tokenParsed: tokenParseData(req.query.slug) 
    });
});

var key = Utf8.parse('mommiespwdnyadisuruhtigapuluhdua');
var iv = Utf8.parse('1092837465839201');

var cipherParams = {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7
}

function encrypt(plaintext) {
    const resultArrayConverted = arrayOfUint8Converted(plaintext)

    return CryptoJS.AES.encrypt(
        arrayToStringConvert(resultArrayConverted),
        key,
        cipherParams
    ).toString(Utf8)
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



// app.get('/webview', addQuery, express.query(), function (req, res) {

//     // var encryptString = qs.escape(encrypt(req.query.param))


//     res.send("<b>Decrypt:</b> <code>" + resultDecrypt +
//         "</code></br> <b>Username:</b> <code>" + decryptSplit[0] +
//         "</code></br> <b>Token:</b> <code>" + decryptSplit[1] +
//         "</code></br> <b>Slug:</b> <code>" + decryptSplit[2] + '</code>')
// })

// // sendFile will go here
// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, '/index.html'));
// });

app.listen(port);
console.log('Server started at http://localhost:' + port);