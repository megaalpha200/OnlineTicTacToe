#!/bin/bash

#Variables
githubRepoName="OnlineTicTacToe" #Replace this with the name of the GitHub Repo
githubURL="https://github.com/megaalpha200/$githubRepoName.git"
dockerStackName="ttt-stack" #Replace this with a new name
persistCertbot=false
gitBranch=false

if [ ! -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

if [ ! -f "./.env" ]; then
    echo "Please create a .env file under this directory!"
    exit 1
fi

# if [ ! -d "./build" ]; then
#     echo "Please upload the build folder under this directory!"
#     exit 1
# fi

echo "CREATE A .env FILE IN THE SAME FOLDER AS THIS FILE BEFORE RUNNING THIS SCRIPT!"
echo

#1. Clone/Pull repository from GitHub.
read -p "Should I Pull from GitHub? (y/N) " ghDecision
if [ "$ghDecision" == "Y" ] || [ "$ghDecision" == "y" ]; then
    if [ -d "./$githubRepoName" ]; then
        echo "### Pulling GitHub Repository..."
        (cd "./$githubRepoName" && git pull)
    else
        echo "### Cloning GitHub Repository..."
        git clone "$githubURL"

        if [ ! "$gitBranch" == false ]; then
            (cd "./$githubRepoName" && git checkout "$gitBranch")
        fi
    fi
fi
echo

#2. Create/Replace "production" folder.
if [ -d "./production" ]; then
    read -p "Should I Replace the Production Folder? (y/N) " proDecision
    if [ "$proDecision" == "Y" ] || [ "$proDecision" == "y" ]; then
        if [ -d "./production/certbot" ]; then
            read -p "Should I Keep the certbot Folder? (y/N) " certbotDecision
            if [ "$certbotDecision" == "Y" ] || [ "$certbotDecision" == "y" ]; then
                echo "### Backing up certbot Folder..."
                sudo cp -r ./production/certbot ./certbot
                persistCertbot=true
            fi
        fi

        echo "### Removing Old Production Folder..."
        sudo rm -r ./production
        echo "### Creating Production Folder..."
        mkdir production
    fi
else
    echo "### Creating Production Folder..."
    mkdir production
fi
echo

#3. Copy contents of GitHub repository clone into the "production" folder.
echo "### Copying Repository Folder Contents to Production..."
cp -a "./$githubRepoName/." ./production
echo

#4. Copy the ".env" file into the root of the production/backend folder.
echo "### Copying .env File to Production Backend..."
cp ./.env ./production/backend/.env
echo

#5. Copy the "build" folder into the root of the production/frontend folder.
# echo "### Copying build folder to Production Frontend..."
# cp -r ./build ./production/frontend/build
# echo

#6. Check if a login is present for Docker. If so continue, if not request login. If login unsuccessful, then exit.
# echo "### Checking Docker Login Status..."
# if [ ! grep -q "index.docker.io" ~/.docker/config.json ]; then
#     docker login
# fi
echo "### Logging in to Docker Hub..."
docker login
echo

#7. Build & Push the Docker Containers.
read -p "Should I Re-build the Docker Images? (y/N) " dockerBuildDecision
if [ "$dockerBuildDecision" == 'Y' ] || [ "$dockerBuildDecision" == 'y' ]; then
    echo "### Building Docker Containers..."
    (cd ./production && docker-compose build)
    echo
    echo "### Pushing Docker Containers..."
    (cd ./production && docker-compose push)
    echo
fi

#8. Verifying if Docker Swarm is Initialized
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

(cd ./production && docker stack rm "$dockerStackName")
sleep 2
echo

#9. Get SSL Certificate(s)
# if [ "$persistCertbot" == true ]; then
#     echo "### Restoring the certbot Folder..."
#     sudo cp -r ./certbot ./production/certbot
#     sudo rm -r ./certbot
# fi
# (cd ./production && chmod +x ./init-letsencrypt.sh && ./init-letsencrypt.sh)

# echo "### Sleeping..."
# sleep 2
# echo

#10. Deploy the Docker stack.
echo "### Deploying Docker Stack..."
(cd ./production && docker stack deploy -c docker-compose.yml "$dockerStackName")
echo

#11. Clean Up Docker Cache
read -p "Should I Clean Up the Docker Cache? (y/N) " dockerCleanDecision
if [ "$dockerCleanDecision" == 'Y' ] || [ "$dockerCleanDecision" == 'y' ]; then
    echo "### Cleaning Up Docker Cache..."
    docker container prune -f
    docker image prune -f
    docker volume prune -f
    docker network prune -f
    echo
fi

echo "### All Done! :)..."