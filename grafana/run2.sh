 #!/bin/bash

echo 'Starting Grafana...'
/run.sh "$@" &

AddDataSource() {
  curl 'http://localhost:3000/api/datasources' \
    -X POST \
    -H 'Content-Type: application/json;charset=UTF-8' \
    -H 'Authorization: Basic YWRtaW46YWRtaW4=' \
    --data-binary \
    '{"name":"Prometheus","type":"prometheus","url":"http://localhost:9090","access":"direct","isDefault":true}'
}

AddDashboard() {
    curl 'http://localhost:3000/api/dashboards' \
    -X POST \
    -H 'Content-Type: application/json;charset=UTF-8' \
    -H 'Authorization: Basic YWRtaW46YWRtaW4=' \
    -d @dashboard.json
}

until AddDataSource; do
  echo 'Configuring Grafana data source...'
  sleep 1
done

#until AddDashboard; do
#  echo 'Configuring Grafana dashboard...'
#  sleep 1
#done

echo 'Done!'
wait