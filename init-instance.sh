#!/bin/bash

#Initializes the AWS Instance

#Variables
githubRepoName="OnlineTicTacToe" #Replace this with the name of the GitHub Repo

#Create Swap Partition
echo "### Creating Swap Partition..."
dd if=/dev/zero of=/swapfile count=2048 bs=1MiB
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo "/swapfile swap swap sw 0 0" | tee -a /etc/fstab
echo

#Check for Package Updates
echo "### Checking for Package Updates..."
yum check-update && yum update -y && yum upgrade -y && yum clean packages
echo

echo "### Installing Docker, Git, Python 3, PIP, and htop..."
yum install docker git python3 python3-pip -y htop
echo

echo "### Installing Docker Compose..."
pip3 install docker-compose
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
    groupadd docker
    usermod -aG docker ec2-user
    systemctl start docker
    systemctl enable docker
    echo "Docker Compose Installed Successfully!" >&2
else
    echo "Error! Docker Compose could not install successfully!" >&2
    success=-1
fi

echo

if [ $success == 1 ]; then
    mkdir /home/ec2-user/"$githubRepoName"
    chown ec2-user:ec2-user /home/ec2-user/"$githubRepoName"
    echo "Navigate to the project directory using \"cd /home/ec2-user/$githubRepoName\""
    echo
    echo
    echo "Yay! Everything was successfully initialized!"
    sudo reboot -h now
else
    echo "Oh no! Something went horribly wrong!"
fi