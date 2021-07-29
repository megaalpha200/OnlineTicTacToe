#!/bin/bash

#Variables
githubRepoName="OnlineTicTacToe" #Replace this with the name of the GitHub Repo
githubURL="https://github.com/megaalpha200/$githubRepoName.git"
gitBranch=false

if [ ! -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

echo "Please ensure the following steps are taken BEFORE CONTINUING TO RUNNING THIS SCRIPT:"
echo "1. Make sure the Docker Daemon IS RUNNING."
echo "2. Create a .env file IN THE SAME FOLDER AS THIS SCRIPT."
echo
read -p "Have these steps been taken? (y/N) " initDecision
if [ "$initDecision" == "N" ] || [ "$initDecision" == "n" ]; then
    exit 1
fi
echo

if [ ! -f "./.env" ]; then
    echo "Please create a .env file under this directory!"
    exit 1
fi

#1. Create/Re-create Build Folder and Check for a .env File
if [ -d "./build" ]; then
    sudo rm -r ./build
fi

mkdir build
cp ./.env ./build/.env
cd ./build
echo

#2. Clone/Pull repository from GitHub.
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

#3. Create/Replace "production" folder.
if [ -d "./production" ]; then
    read -p "Should I Replace the Production Folder? (y/N) " proDecision
    if [ "$proDecision" == "Y" ] || [ "$proDecision" == "y" ]; then
        echo "### Removing Old Production Folder..."
        sudo rm -r ./production
        echo "### Creating Production Folder..."
        mkdir production

        #3a. Copy contents of GitHub repository clone into the "production" folder.
        echo "### Copying Repository Folder Contents to Production..."
        cp -a "./$githubRepoName/." ./production
        echo
    fi
else
    echo "### Creating Production Folder..."
    mkdir production

    #3a. Copy contents of GitHub repository clone into the "production" folder.
    echo "### Copying Repository Folder Contents to Production..."
    cp -a "./$githubRepoName/." ./production
    echo
fi
echo

#4. Copy the ".env" file into the root of the production/backend folder.
echo "### Copying .env File to Production Backend..."
cp ./.env ./production/backend/.env
echo

#5. Check if a login is present for Docker. If so continue, if not request login. If login unsuccessful, then exit.
echo "### Logging in to Docker Hub..."
docker login
echo

#6. Build & Push the Docker Containers.
read -p "Should I Re-build the Docker Images? (y/N) " dockerBuildDecision
if [ "$dockerBuildDecision" == 'Y' ] || [ "$dockerBuildDecision" == 'y' ]; then
    echo "### Building Docker Containers..."
    (cd ./production && docker-compose build)
    echo
    echo "### Pushing Docker Containers..."
    (cd ./production && docker-compose push)
    echo
fi

#7. Clean Up Docker Cache
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
