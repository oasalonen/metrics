# metrics
Playground for monitoring with Prometheus and Grafana.

## Usage
To start the services run
```
docker-compose up
```

## Load testing
You can simulate load on the web app by going to the web/ folder and running
```
npm run load
```
You can also simulate errors (random 500 status codes from the ping endpoint) by POSTing to the web app, for example
```
curl -X POST http://localhost:9021/deploy?simulateErrors=1
```
This will also create an annotation in the Grafana graph for a new "deployment" of the web app, after which you will either see the error curve rising or disappearing depending on whether you enable or disable the error simulation.

## Viewing graphs
Open Grafana at ```http://localhost:3000``` and log in with the default credentials (admin:admin). Open the Metrics dashboard.
