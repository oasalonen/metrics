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
You can also simulate errors by setting the following variable in ```web/server.js```
```
SIMULATE_FAILURE = true;
```

## Viewing graphs
Open Grafana at ```http://localhost:3000``` and log in with the default credentials (admin:admin). Open the Metrics dashboard.
