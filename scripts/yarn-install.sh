#!/usr/bin/env bash

echo "Updating system packages..."
sudo apt update -y && sudo apt upgrade -y

if command -v node &> /dev/null
then
    echo "Node.js is already installed: $(node -v)"
else
    echo "Installing Node.js (via NVM)..."

    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
    
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    nvm install --lts
    nvm use --lts

    echo "Node.js installed: $(node -v)"
fi

if command -v yarn &> /dev/null
then
    echo "Yarn is already installed: $(yarn -v)"
else
    echo "Installing Yarn..."
    npm install -g yarn
    echo "Yarn installed: $(yarn -v)"
fi

echo "Installation completed."
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"
echo "Yarn version: $(yarn -v)"
