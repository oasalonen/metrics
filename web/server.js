const express = require('express');
const prom = require('prom-client');
const fetch = require('node-fetch');
const responseTime  = require('response-time');

const PORT = 9021;
let simulateErrors = false;
let versionNumber = 1;

const app = express();

const counter = new prom.Counter({
    name: 'api_http_requests_total',
    help: 'api_http_requests_total_help',
    labelNames: ['endpoint', 'method', 'statusCode']
});

const timeGauge = new prom.Gauge({
    name: 'api_http_response_time',
    help: 'api_http_response_time_help',
    labelNames: ['endpoint', 'method', 'statusCode']
});

function incrementApiCounter(req, res) {
    counter.inc({
        enpoint: req.path,
        method: req.method, 
        statusCode: res.statusCode
    });
}

app.use(responseTime(function (req, res, time) {
    timeGauge.set({
        endpoint: req.path,
        method: req.method,
        statusCode: res.statusCode
    }, time);
}));

app.get('/ping', (req, res) => {
    const status = simulateErrors && Math.random() > 0.8 ? 500 : 200; 
    res.status(status).end();
    incrementApiCounter(req, res);
});

app.post('/deploy', (req, res) => {
    versionNumber++;
    simulateErrors = JSON.parse(req.query.simulateErrors);

    fetch('http://grafana:3000/api/annotations', {
        method: 'POST',
        headers: { 
            'Accepts': 'application-json',
            'Content-Type': 'application-json',
            'Authorization': 'Basic ' + Buffer.from('admin:admin').toString('base64')
        },
        body: JSON.stringify({
            time: Date.now(),
            tags: ["deploy"],
            text: `Web app deployed: v.${versionNumber}`
        })
    });

    res.status(201).end();
    incrementApiCounter(req, res);
});

app.get('/metrics', (req, res) => {
    console.log('metrics endpoint hit');
    res.set('Content-Type', prom.register.contentType);
    res.end(prom.register.metrics());
});

app.listen(PORT, () => { 
    console.log('Listening...');
});

prom.collectDefaultMetrics({timeout: 5000});