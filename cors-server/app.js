const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to CORS server')
})

app.get('/cors', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.send({ "msg": "This has CORS enabled 🎈" })
})

app.get('/proxy', async (req, res) => {
    const { origin } = req.headers;
    res.set('Access-Control-Allow-Origin', origin);
    try {
        const response = await https.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': '41166ed1-59cc-480e-9bf5-174b5090dbe8',
            },
        });
        res.send(response.data);
    } catch (ex) {
        console.log(ex);
        res.status(500).send('Error fetching data from API');
    }
});

app.listen(8080, () => {
    console.log('listening on port 8080')
})