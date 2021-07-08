const express       = require('express');
const CryptoJS      = require("crypto-js");
const Utf8          = require("crypto-js/enc-utf8");
const qs            = require('querystring');
const handlebars    = require('express-handlebars');

const path          = require('path');
const app           = express();
const port          = process.env.PORT || 8080;

// config AES 256
var key = Utf8.parse('mommiespwdnyadisuruhtigapuluhdua');
var iv = Utf8.parse('1092837465839201');

var cipherParams = {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7
}

app.set('view engine', 'hbs');

app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
    partialsDir: __dirname + '/views/partials/'
}));

articleListProd = () => {
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

articleListStaging = () => {
    return [
        {
            link: 'https://editorial.femaledaily.net/blog/2021/04/28/article-paging/2',
            title: 'Article Paging'
        },
        {
            link: 'https://editorial.femaledaily.net/blog/2021/04/12/selain-green-beauty-pernah-dengar-blue-beauty-style-detail',
            title: 'Selain Green Beauty, Pernah Dengar Blue Beauty? style detail'
        },
    ];
}

articleListWithPaging = (query) => {
    var resultDecrypt = decrypt(qs.unescape(query.slug))
    const decryptSplit = resultDecrypt.split('||')
    return [
        {
            slug: decryptSplit[2],
            page: query.page
        }
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
    req.query.page = req.query.page;
    next();
}

// Routing
app.get('/', addQuery, express.query(), (req, res) => {

    res.render('main', { 
        layout: 'index', 
        articlesProd: articleListProd(),
        articlesStaging: articleListStaging(),
        articlesPagination: articleListWithPaging(req.query),
        tokenParsed: tokenParseData(req.query.slug) 
    });
});

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

app.listen(port);
console.log('Server started at http://localhost:' + port);