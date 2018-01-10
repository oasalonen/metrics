FROM grafana/grafana

WORKDIR /grafana
COPY run2.sh .
COPY grafana.ini .
COPY dashboard.json dashboards/

ENV GF_PATHS_CONFIG=/grafana/grafana.ini

ENTRYPOINT [ "/bin/bash", "-c", "/grafana/run2.sh" ]
