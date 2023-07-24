#!/bin/bash

cd ~/app
docker login

case "$(docker info --format '{{.Swarm.LocalNodeState}}')" in
inactive)
    echo "### Initializing Docker Swarm...";
    docker swarm init;
    sleep 5;;
active)
    echo;;
*)
    exit 1;;
esac

/usr/local/bin/docker-compose pull
docker stack rm app-stack
sleep 10
sudo chmod +x ./init-letsencrypt.sh
cat .led | sudo ./init-letsencrypt.sh
sleep 5
docker stack deploy -c docker-compose.yml app-stack