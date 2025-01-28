#!/usr/bin/env bash

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies and build React app
npm install --prefix path/to/your/react-app
npm run build --prefix path/to/your/react-app

# Move the React build folder (dist) to the Flask app
cp -r path/to/your/react-app/dist ./dist
