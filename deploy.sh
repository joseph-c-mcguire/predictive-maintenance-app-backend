#!/bin/bash

# Variables
EC2_USER="ec2-user"
EC2_HOST="ec2-18-221-128-58.us-east-2.compute.amazonaws.com"
SSH_KEY="/c/Users/bigme/OneDrive/Documents/AWS/first-key.pem"
REPO_URL="https://github.com/joseph-c-mcguire/predictive-maintenance-full-stack-webapp.git"  # Replace with your Git repository URL
REMOTE_DIR="~/myapp/predictive-maintenance-full-stack-webapp/"  # The remote directory on the EC2 instance
LOG_FILE="deploy.log"

# Function to run a command and output to both console and log file
run_command() {
  echo "Running: $1" | tee -a $LOG_FILE
  eval $1 2>&1 | tee -a $LOG_FILE
  if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo "Command failed: $1" | tee -a $LOG_FILE
    exit 1
  fi
}

# Step 1: Test SSH connection to EC2 instance
echo "Testing SSH connection to EC2 instance..." | tee $LOG_FILE
run_command "ssh -i \"${SSH_KEY}\" ${EC2_USER}@${EC2_HOST} \"echo 'SSH connection successful'\""

# Step 2: SSH into the EC2 instance, clone the Git repository, and navigate to the project directory
echo "Cloning repository and setting up Docker Compose on EC2 instance..." | tee -a $LOG_FILE
run_command "ssh -i \"${SSH_KEY}\" ${EC2_USER}@${EC2_HOST} << 'EOF'
  set -e
  echo \"Checking if the remote directory ${REMOTE_DIR} exists...\"
  if [ ! -d \"${REMOTE_DIR}\" ]; then
    echo \"Directory does not exist. Cloning the repository...\"
    git clone ${REPO_URL} ${REMOTE_DIR}
  else
    echo \"Directory exists. Pulling the latest changes...\"
    cd ${REMOTE_DIR}
    git pull
  fi
  echo \"Navigating to the project directory...\"
  cd ${REMOTE_DIR}
  echo \"Stopping any existing Docker containers...\"
  docker-compose down
  echo \"Starting Docker Compose application in detached mode...\"
  docker-compose up -d
EOF
"

echo "Deployment complete. Your Docker Compose application is now running on EC2." | tee -a $LOG_FILE
