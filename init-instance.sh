#!/bin/bash

#Initializes the AWS Instance

#Create Swap Partition
echo "### Creating Swap Partition..."
sudo dd if=/dev/zero of=/swapfile count=2048 bs=1MiB
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo "/swapfile swap swap sw 0 0" | sudo tee -a /etc/fstab
echo

#Check for Package Updates
echo "### Checking for Package Updates..."
yum check-update && sudo yum update -y && sudo yum upgrade -y && yum clean packages
echo

echo "### Installing Docker, Git, Python 3, PIP, and htop..."
sudo yum install docker git python3 python3-pip -y htop
echo

echo "### Installing Docker Compose..."
sudo pip3 install docker-compose
echo

success=1

if [ -x "$(command -v git)" ]; then
    echo "Git Installed Successfully!" >&2
else
    echo "Error! Git could not install successfully!" >&2
    success=-1
fi

if [ -x "$(command -v docker)" ]; then
    echo "Docker Installed Successfully!" >&2
else
    echo "Error! Docker could not install successfully!" >&2
    success=-1
fi

if [ -x "$(command -v docker-compose)" ]; then
    sudo groupadd docker
    sudo usermod -aG docker "$USER"
    sudo systemctl start docker
    sudo systemctl enable docker
    echo "Docker Compose Installed Successfully!" >&2
else
    echo "Error! Docker Compose could not install successfully!" >&2
    success=-1
fi

echo

if [ $success == 1 ]; then
    read -p "Enter the name of project directory? " proDir
    if [ ! -d "./$proDir" ]; then
        mkdir $proDir
        echo
        echo "Navigate to the project directory using \"cd $(pwd)/$proDir\""
    else
        echo "The folder already exists! Try making a folder with a different name using \"mkdir <folderName>\""
    fi
    echo
    echo "Yay! Everything was successfully initialized!"
    echo "Please run \"sudo reboot -h now\" to restart the instance and complete the installations!"
else
    echo "Oh no! Something went horribly wrong!"
fi