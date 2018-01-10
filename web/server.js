const express = require('express');
const prom = require('prom-client');
const fetch = require('node-fetch');

const PORT = 9021;
const SIMULATE_FAILURE = true;

const app = express();

const counter = new prom.Counter({
    name: 'ping_endpoint',
    help: 'ping_endpoint_help',
    labelNames: ['method', 'statusCode']
});
app.get('/ping', (req, res) => {
    console.log('ping endpoint hit');
    const status = SIMULATE_FAILURE && Math.random() > 0.8 ? 500 : 200; 
    counter.inc({ method: 'GET', statusCode: status });
    res.status(status).end();
});

app.get('/metrics', (req, res) => {
    console.log('metrics endpoint hit');
    res.set('Content-Type', prom.register.contentType);
    res.end(prom.register.metrics());
});

app.listen(PORT, () => { 
    console.log('Listening...');
});

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
        text: "Web app deployed"
    })
});

prom.collectDefaultMetrics({timeout: 5000});